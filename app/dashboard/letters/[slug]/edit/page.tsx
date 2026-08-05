import { notFound } from "next/navigation";
import { getLetterBySlug } from "@/app/actions";
import EditLetterForm from "@/app/dashboard/letters/[slug]/edit/EditLetterForm";

export default async function EditLetterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const letter = await getLetterBySlug(resolvedParams.slug);

  if (!letter) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-heading text-foreground">
          Edit Surat
        </h2>
        <p className="text-muted-foreground mt-2">
          Perbarui detail surat untuk {letter.recipient_name}.
        </p>
      </div>

      <EditLetterForm letter={letter} slug={resolvedParams.slug} />
    </div>
  );
}
