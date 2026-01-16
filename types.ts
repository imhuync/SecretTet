export interface FriendMemory {
  id: number;
  imageUrl: string;
  name: string;
  letter: string;
  greeting: string;
  personalizedPhotoUrl: string;
}

export enum GameState {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  PLAYING = 'PLAYING',
  WON = 'WON'
}

export interface Envelope {
  id: number;
  amount: number; // Just for internal logic, visual will be symbolic
  isWinner: boolean;
}