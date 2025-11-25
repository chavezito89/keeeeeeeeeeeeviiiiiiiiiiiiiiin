export type KevinPost = {
  id: number;
  imageUrl: string;
  imageHint: string;
  comment: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
};

export type KevinComment = {
  id: number;
  post_id: number;
  username: string;
  comment: string;
  created_at: string;
};
