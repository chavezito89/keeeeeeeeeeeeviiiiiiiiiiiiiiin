export type KevinPost = {
  id: number;
  imageUrl: string;
  imageHint: string;
  comment: string | null;
  latitude: number;
  longitude: number;
  createdAt: string;
  post_likes: { username: string }[];
};

export type KevinComment = {
  id: number;
  post_id: number;
  username: string;
  comment: string;
  created_at: string;
};

export type PostLike = {
  id: number;
  post_id: number;
  username: string;
  created_at: string;
}
