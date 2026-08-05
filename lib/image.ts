export const compressImage = async (file: File, maxWidth = 1080): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((maxWidth * height) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal memuat konteks kanvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Mengonversi ke WebP untuk kompresi maksimal dengan kualitas baik
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Gagal mengonversi kanvas ke blob"));
              return;
            }
            
            const originalName = file.name;
            const extension = originalName.split('.').pop() || '';
            const newName = originalName.replace(`.${extension}`, '') + '.webp';
            
            const compressedFile = new File([blob], newName, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            
            resolve(compressedFile);
          },
          "image/webp",
          0.8 // Kualitas 80%
        );
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};
