export const mockLetterData = {
  metadata: {
    slug: "demo",
    isPrivate: false,
  },
  identity: {
    recipientName: "Sarah",
    senderName: "Bagas",
  },
  content: {
    mainTitle: "Happy Anniversary, Sayang!",
    letterContent: `Hai Sarah,

Nggak kerasa ya, kita udah bareng-bareng selama ini. Tiap detik sama kamu itu rasanya magis banget.

Makasih udah selalu sabar ngadepin aku, selalu jadi pendengar yang baik, dan selalu bikin hari-hariku lebih cerah. Aku berharap kita bisa terus bikin banyak memori indah sama-sama sampai kapanpun.

I love you more than words can say. ❤️

— Bagas`,
    bgmUrl: "https://www.youtube.com/watch?v=jfKfPfyJRdk", // Lofi hip hop radio (relaxing background)
  },
  gallery: [
    {
      id: "1",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
      caption: "Kencan pertama kita! ✨",
    },
    {
      id: "2",
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop",
      caption: "Kamu yang selalu senyum 🌻",
    },
    {
      id: "3",
      imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=600&auto=format&fit=crop",
      caption: "Forever & always. ❤️",
    }
  ]
};

export const mockDashboardStats = {
  totalLetters: 3,
  totalViews: 142,
  activeLetters: 3,
};
