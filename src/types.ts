/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  translation: string;
  category: "garden" | "pet" | "sea" | "animals";
  color: string;
  emoji: string;
  position: [number, number, number];
  scale: [number, number, number] | number;
  thumbnail?: string;
  description?: string;
}

export type ExploreCategory = "garden" | "pet" | "sea" | "animals";

export interface ToastMessage {
  id: string;
  message: string;
  subMessage?: string;
  emoji?: string;
  type: "milestone" | "success" | "star";
}

export interface UserAccount {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface AppState {
  currentWord: VocabularyWord | null;
  learnedWordIds: string[];
  stars: number;
  soundEnabled: boolean;
  activeCategory: ExploreCategory | null; // null represents the World Map
  viewingMap: boolean;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, subMessage?: string, emoji?: string, type?: "milestone" | "success" | "star") => void;
  removeToast: (id: string) => void;
  
  // Particles trigger
  lastLearnedWordId: string | null;
  clearLastLearnedWordId: () => void;
  
  // Milestones
  achievedMilestones: string[];
  
  // Game & Quiz Score tracker
  quizScore: number;
  incrementQuizScore: () => void;
  resetQuizScore: () => void;
  
  // Rewards & Gamification
  rewardsModalOpen: boolean;
  showUnlockNotification: boolean;
  hasSeenChestUnlock: boolean;
  
  // Auth & Admin
  isAuthenticated: boolean;
  currentUser: UserAccount | null;
  users: UserAccount[];
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (username: string, password: string) => true | string;
  logout: () => void;
  register: (username: string, email: string, password: string) => true | string;
  deleteUser: (username: string) => void;
  
  // Settings & Customization
  challengeEnabled: boolean;
  funModeEnabled: boolean;
  narrativeModeEnabled: boolean;
  loginStreak: number;
  lastLoginDate: string | null;
  immersive3D: boolean;
  environmentTheme: "day" | "night" | "twilight";
  skyboxBackground: "plain" | "mountain" | "underwater" | "space";

  // 3D Drawing Board State
  drawingModeEnabled: boolean;
  activeDrawingTool: "free" | "cube" | "sphere" | "cylinder" | "star" | "cone" | "orbit";
  activeDrawingColor: string;
  activeBrushSize: number;
  currentDrawingElements: DrawingElement[];
  savedDrawings: SavedDrawing[];
  
  // Actions
  selectWord: (word: VocabularyWord) => void;
  closeWordCard: () => void;
  learnWord: (wordId: string) => void;
  toggleSound: () => void;
  toggleChallenge: () => void;
  toggleFunMode: () => void;
  toggleNarrativeMode: () => void;
  toggleImmersive3D: () => void;
  setEnvironmentTheme: (theme: "day" | "night" | "twilight") => void;
  setSkyboxBackground: (bg: "plain" | "mountain" | "underwater" | "space") => void;
  
  // 3D Drawing Actions
  toggleDrawingMode: () => void;
  setDrawingTool: (tool: "free" | "cube" | "sphere" | "cylinder" | "star" | "cone" | "orbit") => void;
  setDrawingColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  addDrawingElement: (element: DrawingElement) => void;
  setDrawingElements: (elements: DrawingElement[]) => void;
  clearDrawing: () => void;
  saveCurrentDrawing: (name: string, thumbnail?: string) => void;
  loadSavedDrawing: (drawingId: string) => void;
  deleteSavedDrawing: (drawingId: string) => void;
  loadSharedDrawing: (category: ExploreCategory, elements: DrawingElement[]) => void;

  setCategory: (category: ExploreCategory | null) => void;
  addStar: (amount: number) => void;
  resetProgress: () => void;
  setRewardsModalOpen: (open: boolean) => void;
  setShowUnlockNotification: (show: boolean) => void;
  setSeenChestUnlock: (seen: boolean) => void;
  checkLoginStreak: () => void;
  // Vocabulary management (admin)
  addWord: (word: VocabularyWord) => boolean;
  updateWord: (word: VocabularyWord) => boolean;
  deleteWord: (id: string) => boolean;
  // Current vocabulary list (keeps UI reactive)
  vocab: VocabularyWord[];
}

export interface DrawingElement {
  id: string;
  type: "free" | "cube" | "sphere" | "cylinder" | "star" | "cone";
  color: string;
  size: number;
  points?: [number, number, number][];
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export interface SavedDrawing {
  id: string;
  name: string;
  dateTime: string;
  category: ExploreCategory;
  elements: DrawingElement[];
  thumbnail?: string;
}

