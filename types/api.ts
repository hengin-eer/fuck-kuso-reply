export type ApiErrorResponse = {
  error: string;
  details?: string;
};

export type ReplyData = {
  id: string;
  user_name: string;
  user_id: string;
  aggressive: { text: string; emoji: string };
  scared: { text: string; emoji: string };
};

export type GenerateRepliesResponse = {
  replies: ReplyData[];
};
