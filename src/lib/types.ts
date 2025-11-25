export type KevinPost = {
  id: string;
  imageUrl: string;
  imageHint: string;
  comment: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
};

export type KevinComment = {
  id: string;
  post_id: string;
  username: string;
  comment: string;
  created_at: string;
};
