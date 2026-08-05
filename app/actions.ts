/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createClient } from "@/utils/supabase/server";
import { letterSchema } from "@/lib/schemas/letter";
import { revalidatePath } from "next/cache";

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: string };

export async function createLetterAction(
  prevState: any,
  formData: FormData
): Promise<ActionResponse<string>> {
  try {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in first." };
    }

    // Parse formData
    const rawData = {
      recipientName: formData.get("recipientName") as string,
      senderName: formData.get("senderName") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      bgmUrl: formData.get("bgmUrl") as string || "",
      isPublic: formData.has("isPublic") ? formData.get("isPublic") === "true" : true,
      interactiveType: formData.get("interactiveType") as string || "none",
      whatsappNumber: formData.get("whatsappNumber") as string || "",
      interactiveData: {
        theme: formData.get("interactiveData.theme") as string || "default",
        question: formData.get("interactiveData.question") as string || "",
        password: formData.get("interactiveData.password") as string || "",
        yesLabel: formData.get("interactiveData.yesLabel") as string || "",
        noLabel: formData.get("interactiveData.noLabel") as string || "",
        options: formData.get("interactiveData.options") as string || "",
      }
    };

    // Validate
    const validatedData = letterSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    // Generate unique slug
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 7);
    const slug = `${validatedData.data.recipientName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${timestamp}-${randomString}`;

    // Insert Letter
    const { data: letter, error: letterError } = await supabase
      .from("letters")
      .insert({
        user_id: user.id,
        slug,
        recipient_name: validatedData.data.recipientName,
        sender_name: validatedData.data.senderName,
        title: validatedData.data.title,
        content: validatedData.data.content,
        bgm_url: validatedData.data.bgmUrl,
        is_public: validatedData.data.isPublic,
        status: "draft",
        interactive_type: validatedData.data.interactiveType,
        interactive_data: validatedData.data.interactiveData,
        whatsapp_number: validatedData.data.whatsappNumber,
      })
      .select("id")
      .single();

    if (letterError) throw letterError;

    // Process Photos (Upload to Supabase Storage)
    const newPhotos = formData.getAll("newPhotos") as File[];
    const photoCaptions = formData.getAll("photoCaptions") as string[];
    const photoUrls: string[] = [];
    
    // We only have new photos in create, so we can just iterate newPhotos directly
    for (let i = 0; i < newPhotos.length; i++) {
      const file = newPhotos[i];
      if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop() || 'webp';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${user.id}/${slug}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from("dearly-photos")
          .upload(filePath, file);
          
        if (uploadError) throw new Error(`Failed to upload photo: ${uploadError.message}`);
        
        const { data: publicUrlData } = supabase.storage
          .from("dearly-photos")
          .getPublicUrl(filePath);
          
        photoUrls.push(publicUrlData.publicUrl);
      }
    }
    
    if (photoUrls.length > 0) {
      const photosData = photoUrls.map((url, index) => ({
        letter_id: letter.id,
        image_url: url,
        caption: photoCaptions[index] || "",
        sort_order: index,
      }));

      const { error: photosError } = await supabase.from("photos").insert(photosData);
      if (photosError) throw photosError;
    }

    revalidatePath("/dashboard");
    return { success: true, data: slug };

  } catch (error: any) {
    console.error("Create letter error:", error);
    return { success: false, error: error.message || "Failed to create letter" };
  }
}

export async function updateLetterAction(
  slug: string,
  prevState: any,
  formData: FormData
): Promise<ActionResponse<string>> {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Unauthorized. Please log in first." };
    }

    // Verify ownership
    const { data: existingLetter, error: fetchError } = await supabase
      .from("letters")
      .select("id, user_id")
      .eq("slug", slug)
      .single();

    if (fetchError || !existingLetter) {
      return { success: false, error: "Letter not found" };
    }

    if (existingLetter.user_id !== user.id) {
      return { success: false, error: "Unauthorized to edit this letter" };
    }

    const rawData = {
      recipientName: formData.get("recipientName") as string,
      senderName: formData.get("senderName") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      bgmUrl: formData.get("bgmUrl") as string || "",
      isPublic: formData.has("isPublic") ? formData.get("isPublic") === "true" : true,
      interactiveType: formData.get("interactiveType") as string || "none",
      whatsappNumber: formData.get("whatsappNumber") as string || "",
      interactiveData: {
        theme: formData.get("interactiveData.theme") as string || "default",
        question: formData.get("interactiveData.question") as string || "",
        password: formData.get("interactiveData.password") as string || "",
        yesLabel: formData.get("interactiveData.yesLabel") as string || "",
        noLabel: formData.get("interactiveData.noLabel") as string || "",
        options: formData.get("interactiveData.options") as string || "",
      }
    };

    const validatedData = letterSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const { error: letterError } = await supabase
      .from("letters")
      .update({
        recipient_name: validatedData.data.recipientName,
        sender_name: validatedData.data.senderName,
        title: validatedData.data.title,
        content: validatedData.data.content,
        bgm_url: validatedData.data.bgmUrl,
        is_public: validatedData.data.isPublic,
        interactive_type: validatedData.data.interactiveType,
        interactive_data: validatedData.data.interactiveData,
        whatsapp_number: validatedData.data.whatsappNumber,
      })
      .eq("id", existingLetter.id);

    if (letterError) throw letterError;

    // Photos Processing
    const newPhotos = formData.getAll("newPhotos") as File[];
    const existingPhotoIds = formData.getAll("existingPhotoIds") as string[];
    const photoCaptions = formData.getAll("photoCaptions") as string[];
    const photoSource = formData.getAll("photoSource") as string[]; // 'new' or 'existing'

    // Delete photos that are no longer in the form
    const { data: oldPhotos } = await supabase
      .from("photos")
      .select("id, image_url")
      .eq("letter_id", existingLetter.id);

    const oldPhotoIdsToKeep = new Set(existingPhotoIds);
    const photosToDelete = oldPhotos?.filter(p => !oldPhotoIdsToKeep.has(p.id)) || [];
    
    if (photosToDelete.length > 0) {
      const idsToDelete = photosToDelete.map(p => p.id);
      await supabase.from("photos").delete().in("id", idsToDelete);
      // We could also delete them from storage, but we'll skip for simplicity right now
    }

    // Reconstruct photos order
    let newPhotoIdx = 0;
    let existingPhotoIdx = 0;
    
    for (let sortOrder = 0; sortOrder < photoSource.length; sortOrder++) {
      const source = photoSource[sortOrder];
      const caption = photoCaptions[sortOrder] || "";
      
      if (source === "new") {
        const file = newPhotos[newPhotoIdx++];
        if (file && file.size > 0) {
          const fileExt = file.name.split('.').pop() || 'webp';
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
          const filePath = `${user.id}/${slug}/${fileName}`;
          
          await supabase.storage.from("dearly-photos").upload(filePath, file);
          const { data: publicUrlData } = supabase.storage.from("dearly-photos").getPublicUrl(filePath);
          
          await supabase.from("photos").insert({
            letter_id: existingLetter.id,
            image_url: publicUrlData.publicUrl,
            caption: caption,
            sort_order: sortOrder,
          });
        }
      } else if (source === "existing") {
        const photoId = existingPhotoIds[existingPhotoIdx++];
        if (photoId) {
          await supabase.from("photos")
            .update({ caption: caption, sort_order: sortOrder })
            .eq("id", photoId);
        }
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/to/${slug}`);
    return { success: true, data: slug };

  } catch (error: any) {
    console.error("Update letter error:", error);
    return { success: false, error: error.message || "Failed to update letter" };
  }
}

export async function getLetterBySlug(slug: string) {
  const supabase = await createClient();
  
  const { data: letter, error } = await supabase
    .from("letters")
    .select(`
      *,
      photos (*)
    `)
    .eq("slug", slug)
    .single();

  if (error || !letter) {
    console.error("getLetterBySlug error:", error, "for slug:", slug);
    return null;
  }
  
  letter.photos.sort((a: any, b: any) => a.sort_order - b.sort_order);

  return letter;
}

export async function getUserLetters() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data: letters, error } = await supabase
    .from("letters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
    
  if (error || !letters) return [];
  return letters;
}

export async function incrementLetterViews(slug: string) {
  const supabase = await createClient();
  
  // Note: For a robust system we'd use a Supabase RPC to atomic increment. 
  // We'll fetch and update for Phase 3 MVP.
  const { data: letter } = await supabase
    .from("letters")
    .select("views")
    .eq("slug", slug)
    .single();
    
  if (letter) {
    await supabase
      .from("letters")
      .update({ views: (letter.views || 0) + 1 })
      .eq("slug", slug);
  }
}

export async function publishLetter(slug: string): Promise<ActionResponse<null>> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  const { error } = await supabase
    .from("letters")
    .update({ status: 'published' })
    .eq("slug", slug)
    .eq("user_id", user.id);
    
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/dashboard");
  return { success: true, data: null };
}

export async function deleteLetter(slug: string): Promise<ActionResponse<null>> {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };
  
  const { error } = await supabase
    .from("letters")
    .delete()
    .eq("slug", slug)
    .eq("user_id", user.id);
    
  if (error) return { success: false, error: error.message };
  
  revalidatePath("/dashboard");
  return { success: true, data: null };
}
