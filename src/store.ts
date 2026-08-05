/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from "zustand";
import { AppState, VocabularyWord, ExploreCategory } from "./types";
import { playPopSound, playSparkleSound, playClickSound, speakEnglish, speakSharedNarrative, startAmbientSound, stopAmbientSound } from "./utils/audio";

export const VOCABULARY_DATA: VocabularyWord[] = [
  // --- FRUIT GARDEN AREA ---
  {
    id: "apple",
    word: "Apple",
    meaning: "Quả táo",
    pronunciation: "/ˈæpl/",
    example: "The red apple is sweet!",
    translation: "Quả táo màu đỏ này ngọt lắm!",
    category: "garden",
    color: "#EF4444", // Vibrant Red
    emoji: "🍎",
    position: [-2, 0.4, 1],
    scale: 0.8,
    description: "Táo rất giàu vitamin C và chất xơ, giúp răng bé thêm chắc khỏe và cơ thể luôn tràn đầy năng lượng!"
  },
  {
    id: "orange",
    word: "Orange",
    meaning: "Quả cam",
    pronunciation: "/ˈɒrɪndʒ/",
    example: "I drink orange juice every morning.",
    translation: "Tớ uống nước cam ép mỗi buổi sáng.",
    category: "garden",
    color: "#F97316", // Bright Orange
    emoji: "🍊",
    position: [0, 0.4, 1.2],
    scale: 0.85,
    description: "Trái cam chứa hàm lượng Vitamin C dồi dào, giúp tăng sức đề kháng của bé để chống lại cảm cúm đấy!"
  },
  {
    id: "banana",
    word: "Banana",
    meaning: "Quả chuối",
    pronunciation: "/bəˈnænə/",
    example: "Bananas are yellow and delicious.",
    translation: "Chuối có màu vàng và quả thực rất ngon.",
    category: "garden",
    color: "#ECC94B", // Yellow
    emoji: "🍌",
    position: [2, 0.4, 0.8],
    scale: 0.95,
    description: "Chuối là siêu thực phẩm cung cấp nhiều Kali, giúp cơ bắp bé khỏe mạnh và nạp năng lượng cực nhanh!"
  },
  {
    id: "grapes",
    word: "Grapes",
    meaning: "Quả nho",
    pronunciation: "/ɡreɪps/",
    example: "Look at the purple grapes on the vine!",
    translation: "Hãy nhìn những trái nho tím trên giàn kìa!",
    category: "garden",
    color: "#8B5CF6", // Purple
    emoji: "🍇",
    position: [-1, 0.35, -1],
    scale: 0.75,
    description: "Những quả nho mọc thành chùm xinh xắn chứa rất nhiều chất chống oxy hóa giúp bảo vệ đôi mắt luôn sáng ngời!"
  },
  {
    id: "strawberry",
    word: "Strawberry",
    meaning: "Quả dâu tây",
    pronunciation: "/ˈstrɔːbəri/",
    example: "Strawberries are red with tiny seeds.",
    translation: "Dâu tây có màu đỏ cùng những hạt nhỏ li ti.",
    category: "garden",
    color: "#EC4899", // Pinkish Red
    emoji: "🍓",
    position: [1.2, 0.35, -1.2],
    scale: 0.8,
    description: "Dâu tây là loài quả mọng duy nhất mang hạt ở bên ngoài vỏ. Trung bình một quả dâu tây có tới 200 hạt nhỏ lí tí."
  },

  // --- PET HOUSE AREA ---
  {
    id: "cat",
    word: "Cat",
    meaning: "Con mèo",
    pronunciation: "/kæt/",
    example: "The cute cat says 'Meow'!",
    translation: "Chú mèo con dễ thương kêu 'Meo meo'!",
    category: "pet",
    color: "#F59E0B", // Golden Orange
    emoji: "🐱",
    position: [-2, 0.5, 0.8],
    scale: 0.9,
    description: "Mèo có bộ râu nhạy cảm như một chiếc radar giúp chúng đo đạc khoảng cách và giữ thăng bằng nhảy rất siêu!"
  },
  {
    id: "dog",
    word: "Dog",
    meaning: "Con chó",
    pronunciation: "/dɒɡ/",
    example: "The little dog wags its tail.",
    translation: "Chú chó nhỏ đang vẫy chiếc đuôi của mình.",
    category: "pet",
    color: "#854D0E", // Brown
    emoji: "🐶",
    position: [0, 0.45, 1.2],
    scale: 0.9,
    description: "Chú chó có chiếc mũi siêu thính, ngửi được mùi hương cách xa hàng ngàn mét và là người bạn vô cùng trung thành!"
  },
  {
    id: "rabbit",
    word: "Rabbit",
    meaning: "Con thỏ",
    pronunciation: "/ˈræbɪt/",
    example: "The white rabbit hops up and down.",
    translation: "Chú thỏ trắng nhảy lò cò lên xuống.",
    category: "pet",
    color: "#E2E8F0", // Soft Gray / White
    emoji: "🐰",
    position: [2, 0.45, 0.8],
    scale: 0.85,
    description: "Đôi tai dài của loài thỏ không chỉ giúp chúng nghe tiếng động từ rất xa mà còn tỏa bớt nhiệt để làm mát cơ thể."
  },
  {
    id: "bear",
    word: "Bear",
    meaning: "Con gấu",
    pronunciation: "/beər/",
    example: "The big brown bear likes honey.",
    translation: "Chú gấu nâu lớn rất thích ăn mật ong.",
    category: "pet",
    color: "#78350F", // Dark brown
    emoji: "🐻",
    position: [-1.2, 0.6, -1.2],
    scale: 1.1,
    description: "Bé có biết loài gấu thích ngủ một giấc thật dài suốt cả mùa đông lạnh giá không? Đó gọi là quá trình 'ngủ đông'!"
  },
  {
    id: "pig",
    word: "Pig",
    meaning: "Con heo",
    pronunciation: "/pɪɡ/",
    example: "The pink pig rolls in the mud.",
    translation: "Chú heo hồng thích lăn lộn trong vũng bùn.",
    category: "pet",
    color: "#F472B6", // Sweet Pink
    emoji: "🐷",
    position: [1.2, 0.5, -1],
    scale: 0.9,
    description: "Heo là loài động vật rất thông minh và cực kỳ sạch sẽ! Chúng lăn bùn là để bảo vệ da khỏi ánh nắng mặt trời."
  },

  // --- OCEAN / SEA WORLD ---
  {
    id: "fish",
    word: "Fish",
    meaning: "Con cá",
    pronunciation: "/fɪʃ/",
    example: "The blue fish swims in the water.",
    translation: "Chú cá xanh đang bơi dưới làn nước mát.",
    category: "sea",
    color: "#06B6D4", // Cyan
    emoji: "🐟",
    position: [-2, 0.5, 1],
    scale: 0.85,
    description: "Cá thở bằng mang để lấy Oxy trực tiếp từ nước, và bơi lội uốn lượn nhờ sự lái hướng nhịp nhàng của các loại vây."
  },
  {
    id: "crab",
    word: "Crab",
    meaning: "Con cua",
    pronunciation: "/kræb/",
    example: "The red crab walks sideways on the sand.",
    translation: "Chú cua đỏ đang bò ngang trên bãi cát.",
    category: "sea",
    color: "#EF4444", // Coral Red
    emoji: "🦀",
    position: [0.1, 0.25, 1.2],
    scale: 0.8,
    description: "Hầu hết các chú cua đều bò ngang vì các khớp chân của chúng chỉ gập được sang hai bên trái phải mà thôi!"
  },
  {
    id: "starfish",
    word: "Starfish",
    meaning: "Sao biển",
    pronunciation: "/ˈstɑːfɪʃ/",
    example: "The happy starfish has five arms.",
    translation: "Bạn sao biển hạnh phúc có năm chiếc cánh.",
    category: "sea",
    color: "#FB7185", // Amber/Gold or pinkish
    emoji: "⭐",
    position: [2, 0.15, 0.7],
    scale: 0.8,
    description: "Sao biển không có não và cũng chẳng có máu đỏ. Kỳ diệu là nếu bị đứt một cánh, chúng có thể tự mọc lại cánh mới!"
  },
  {
    id: "whale",
    word: "Whale",
    meaning: "Cá voi",
    pronunciation: "/weɪl/",
    example: "The big whale sprays water up high!",
    translation: "Chú cá voi khổng lồ phun nước lên thật cao!",
    category: "sea",
    color: "#3B82F6", // Oceanic Blue
    emoji: "🐳",
    position: [-1, 0.7, -1.2],
    scale: 1.3,
    description: "Cá voi xanh là loài động vật lớn nhất từng tồn tại trên Trái Đất, nặng bằng 30 chú voi châu Phi cộng lại!"
  },
  {
    id: "octopus",
    word: "Octopus",
    meaning: "Con bạch tuộc",
    pronunciation: "/ˈɒktəpʊs/",
    example: "The purple octopus has eight wiggly legs.",
    translation: "Bạn bạch tuộc tím có tám cái chân ngoằn ngoèo.",
    category: "sea",
    color: "#D946EF", // Orchid Purple
    emoji: "🐙",
    position: [1.2, 0.45, -1],
    scale: 0.95,
    description: "Bạch tuộc là nhà thông thái biển cả! Chúng sở hữu đến 3 trái tim và dòng máu lưu thông có màu xanh lam cực mát mắt."
  },
  
  // --- WILD ANIMALS AREA ---
  {
    id: "lion",
    word: "Lion",
    meaning: "Con sư tử",
    pronunciation: "/ˈlaɪən/",
    example: "The brave lion roars loudly!",
    translation: "Chú sư tử dũng cảm gầm thật to!",
    category: "animals",
    color: "#F59E0B", // Golden Yellow
    emoji: "🦁",
    position: [-1.8, 0.5, 1],
    scale: 1.05,
    description: "Được mệnh danh là 'Chúa tể rừng xanh', tiếng gầm dũng mãnh của một chú sư tử đực có thể vang xa tới tận 8 cây số!"
  },
  {
    id: "elephant",
    word: "Elephant",
    meaning: "Con voi",
    pronunciation: "/ˈelɪfənt/",
    example: "The big elephant has a long trunk.",
    translation: "Chú voi to lớn có chiếc vòi thật dài.",
    category: "animals",
    color: "#64748B", // Slate Blue-Grey
    emoji: "🐘",
    position: [0, 0.6, -1.2],
    scale: 1.2,
    description: "Chiếc vòi của voi vô cùng đa năng! Voi sử dụng vòi giống như cánh tay để ăn uống, hút nước tắm hay chào hỏi bạn bè."
  },
  {
    id: "monkey",
    word: "Monkey",
    meaning: "Con khỉ",
    pronunciation: "/ˈmʌŋki/",
    example: "The funny monkey climbs trees quickly.",
    translation: "Chú khỉ lém lỉnh leo cây rất nhanh nhẹn.",
    category: "animals",
    color: "#B45309", // Warm amber brown
    emoji: "🐒",
    position: [1.8, 0.55, 0.8],
    scale: 0.85,
    description: "Loài khỉ cực kỳ thông minh! Chúng biết dùng đá để đập các quả hạt cứng và xếp lá cây làm ô che mưa che nắng."
  },
  {
    id: "zebra",
    word: "Zebra",
    meaning: "Ngựa vằn",
    pronunciation: "/ˈzebrə/",
    example: "The zebra has beautiful black and white stripes.",
    translation: "Chú ngựa vằn có sọc đen và trắng tuyệt đẹp.",
    category: "animals",
    color: "#1E293B", // Deep slate black
    emoji: "🦓",
    position: [-1.2, 0.5, -0.8],
    scale: 0.95,
    description: "Mỗi chú ngựa vằn nuôi dưỡng một bộ hoa văn sọc đen trắng hoàn toàn độc nhất vô nhị, tựa như dấu vân tay của con người."
  },
  {
    id: "giraffe",
    word: "Giraffe",
    meaning: "Hươu cao cổ",
    pronunciation: "/dʒəˈrɑːf/",
    example: "The tall giraffe eats delicious green leaves.",
    translation: "Bạn hươu cao cổ cao kều ăn lá xanh ngon lành.",
    category: "animals",
    color: "#D97706", // Giraffe Gold
    emoji: "🦒",
    position: [1.2, 0.8, 1.2],
    scale: 1.15,
    description: "Mặc dù sở hữu những chiếc cổ siêu dài và cao nhất thế giới, số lượng đốt sống cổ của hươu cũng chỉ bằng con người là 7 đốt."
  },
  {
    id: "pineapple",
    word: "Pineapple",
    meaning: "Quả dứa",
    pronunciation: "/ˈpaɪnˌæpəl/",
    example: "The sweet pineapple smells so tropical.",
    translation: "Quả dứa ngọt thơm mang hương vị nhiệt đới thật hấp dẫn.",
    category: "garden",
    color: "#F59E0B",
    emoji: "🍍",
    position: [0, 0.5, -2.2],
    scale: 0.95,
    description: "Dứa có lớp vỏ gai xù xì nhưng thịt bên trong lại ngọt mát, giúp bé bổ sung vitamin C nhé!"
  },
  {
    id: "cherry",
    word: "Cherry",
    meaning: "Quả cherry",
    pronunciation: "/ˈtʃeri/",
    example: "The cherries are bright red and shiny.",
    translation: "Những quả cherry đỏ tươi và bóng bẩy quá!",
    category: "garden",
    color: "#EF4444",
    emoji: "🍒",
    position: [-2.5, 0.35, 0],
    scale: 0.75,
    description: "Cherry nhỏ xinh, thường mọc theo từng đôi, vị hơi chua ngọt rất dễ ăn."
  },
  {
    id: "watermelon",
    word: "Watermelon",
    meaning: "Quả dưa hấu",
    pronunciation: "/ˈwɔːtərˌmɛlən/",
    example: "We share a big slice of watermelon in summer.",
    translation: "Chúng ta chia nhau miếng dưa hấu to vào mùa hè. ",
    category: "garden",
    color: "#34D399",
    emoji: "🍉",
    position: [2.4, 0.45, 0],
    scale: 1.0,
    description: "Dưa hấu nhiều nước mát lạnh, rất tốt để giải nhiệt và bổ sung nước cho cơ thể."
  },
  {
    id: "pear",
    word: "Pear",
    meaning: "Quả lê",
    pronunciation: "/pɛər/",
    example: "The juicy pear is sweet and soft.",
    translation: "Quả lê mọng nước, mềm và ngọt dịu lắm. ",
    category: "garden",
    color: "#A3E635",
    emoji: "🍐",
    position: [1.8, 0.4, -1.8],
    scale: 0.85,
    description: "Lê có vị ngọt thanh, chứa nhiều chất xơ giúp hệ tiêu hóa của bé khỏe mạnh."
  },
  {
    id: "peach",
    word: "Peach",
    meaning: "Quả đào",
    pronunciation: "/piːtʃ/",
    example: "The fuzzy peach feels soft in my hand.",
    translation: "Quả đào mềm mịn, cầm vào thấy rất mềm dịu. ",
    category: "garden",
    color: "#FB7185",
    emoji: "🍑",
    position: [-1.8, 0.4, -1.8],
    scale: 0.85,
    description: "Đào là loại quả mềm ngọt, thường có lớp lông nhỏ trên vỏ rất đáng yêu."
  },
  {
    id: "mango",
    word: "Mango",
    meaning: "Quả xoài",
    pronunciation: "/ˈmæŋɡoʊ/",
    example: "A ripe mango is sweet and fragrant.",
    translation: "Xoài chín thơm và ngọt lừ luôn!",
    category: "garden",
    color: "#F59E0B",
    emoji: "🥭",
    position: [-2.5, 0.4, -0.8],
    scale: 0.95,
    description: "Xoài chứa nhiều vitamin A tốt cho mắt của bé và có vị ngọt rất dễ ăn."
  },
  {
    id: "lemon",
    word: "Lemon",
    meaning: "Quả chanh",
    pronunciation: "/ˈlɛmən/",
    example: "A slice of lemon makes the drink fresh.",
    translation: "Một lát chanh làm nước uống tươi mát hơn hẳn. ",
    category: "garden",
    color: "#FDE047",
    emoji: "🍋",
    position: [2.5, 0.4, -0.8],
    scale: 0.8,
    description: "Chanh vàng chua tươi, bé dùng chanh để pha nước thanh mát nhé!"
  },
  {
    id: "kiwi",
    word: "Kiwi",
    meaning: "Quả kiwi",
    pronunciation: "/ˈkiːwi/",
    example: "The green kiwi is soft and delicious.",
    translation: "Quả kiwi xanh mềm và ngon miệng. ",
    category: "garden",
    color: "#22C55E",
    emoji: "🥝",
    position: [0, 0.45, 2.2],
    scale: 0.65,
    description: "Kiwi nhỏ xíu nhưng cực kỳ giàu vitamin C, giúp bé thêm khỏe và sáng mắt."
  },
  {
    id: "turtle",
    word: "Turtle",
    meaning: "Con rùa",
    pronunciation: "/ˈtɜːrtəl/",
    example: "The gentle turtle walks slowly on the grass.",
    translation: "Chú rùa hiền lành bước chậm trên thảm cỏ. ",
    category: "pet",
    color: "#16A34A",
    emoji: "🐢",
    position: [-2.6, 0.4, -0.2],
    scale: 0.8,
    description: "Rùa là bạn thú dễ thương, mang chiếc mai cứng bảo vệ khắp người."
  },
  {
    id: "goldfish",
    word: "Goldfish",
    meaning: "Cá vàng",
    pronunciation: "/ˈɡoʊldˌfɪʃ/",
    example: "The goldfish swims slowly in the bowl.",
    translation: "Con cá vàng bơi chầm chậm trong bát nước. ",
    category: "pet",
    color: "#F97316",
    emoji: "🐠",
    position: [2.6, 0.35, -0.2],
    scale: 0.7,
    description: "Cá vàng là thú cưng nhỏ xinh, thường được nuôi trong bể kính lung linh."
  },
  {
    id: "hamster",
    word: "Hamster",
    meaning: "Con chuột hamster",
    pronunciation: "/ˈhæmstər/",
    example: "The little hamster loves to run in its wheel.",
    translation: "Chú hamster nhỏ thích chạy trên bánh xe lắc lư. ",
    category: "pet",
    color: "#FDE68A",
    emoji: "🐹",
    position: [0, 0.35, 2.4],
    scale: 0.7,
    description: "Hamster nhỏ nhắn, tai tròn, bé thường thích ngắm chúng chạy và ăn hạt."
  },
  {
    id: "parrot",
    word: "Parrot",
    meaning: "Con vẹt",
    pronunciation: "/ˈpærət/",
    example: "The colorful parrot repeats funny words.",
    translation: "Chú vẹt màu sắc lặp lại những từ nói vui nhộn. ",
    category: "pet",
    color: "#10B981",
    emoji: "🦜",
    position: [-1.8, 0.5, 1.8],
    scale: 0.9,
    description: "Vẹt rất thông minh, có thể học nói và trang trí căn phòng thêm rực rỡ."
  },
  {
    id: "ferret",
    word: "Ferret",
    meaning: "Con chồn",
    pronunciation: "/ˈfɛrɪt/",
    example: "The playful ferret sneaks around the toys.",
    translation: "Chú chồn nghịch ngợm lẩn khuất quanh đống đồ chơi. ",
    category: "pet",
    color: "#A16207",
    emoji: "🪱",
    position: [1.8, 0.5, 1.8],
    scale: 0.8,
    description: "Chồn nhỏ dẻo dai, thích khám phá mọi ngóc ngách trong nhà."
  },
  {
    id: "duckling",
    word: "Duckling",
    meaning: "Vịt con",
    pronunciation: "/ˈdʌklɪŋ/",
    example: "The fluffy duckling follows its mother.",
    translation: "Vịt con mềm mại theo sau mẹ đi từng bước. ",
    category: "pet",
    color: "#FDE68A",
    emoji: "🦆",
    position: [0, 0.38, -2.2],
    scale: 0.75,
    description: "Vịt con vàng ươm rất dễ thương và thích quẫy nước."
  },
  {
    id: "chick",
    word: "Chick",
    meaning: "Gà con",
    pronunciation: "/tʃɪk/",
    example: "The fluffy chick peeps softly.",
    translation: "Gà con lông tơ kêu líu lo dễ thương. ",
    category: "pet",
    color: "#FDE68A",
    emoji: "🐥",
    position: [2.4, 0.35, 1.1],
    scale: 0.7,
    description: "Gà con nhỏ nhắn, thân hình xốp mềm như gối bông."
  },
  {
    id: "lizard",
    word: "Lizard",
    meaning: "Con thằn lằn",
    pronunciation: "/ˈlɪzərd/",
    example: "The green lizard climbs on the branch.",
    translation: "Con thằn lằn xanh leo trên cành cây. ",
    category: "pet",
    color: "#4ADE80",
    emoji: "🦎",
    position: [-2.2, 0.35, 1.1],
    scale: 0.75,
    description: "Thằn lằn nhỏ thích tắm nắng và đổi màu nhẹ nhàng."
  },
  {
    id: "jellyfish",
    word: "Jellyfish",
    meaning: "Con sứa",
    pronunciation: "/ˈdʒɛlifaɪʃ/",
    example: "The glowing jellyfish floats slowly in the sea.",
    translation: "Con sứa phát sáng trôi lững lờ dưới nước. ",
    category: "sea",
    color: "#A5F3FC",
    emoji: "🪼",
    position: [2.2, 0.7, 0.4],
    scale: 0.95,
    description: "Sứa mềm mại trôi trên mặt biển như chiếc đèn lồng ánh sáng huyền ảo."
  },
  {
    id: "dolphin",
    word: "Dolphin",
    meaning: "Cá heo",
    pronunciation: "/ˈdɒlfɪn/",
    example: "The playful dolphin jumps above the water.",
    translation: "Cá heo tinh nghịch nhảy lên trên mặt nước. ",
    category: "sea",
    color: "#0EA5E9",
    emoji: "🐬",
    position: [-2.2, 0.63, 0.4],
    scale: 1.1,
    description: "Cá heo thông minh và thân thiện, thường bơi lượn rất nhanh."
  },
  {
    id: "seahorse",
    word: "Seahorse",
    meaning: "Con cá ngựa",
    pronunciation: "/ˈsiːhɔːrs/",
    example: "The golden seahorse waves its tiny tail.",
    translation: "Cá ngựa vàng vẫy chiếc đuôi bé xíu của mình. ",
    category: "sea",
    color: "#FBBF24",
    emoji: "🐴",
    position: [0, 0.55, -2.2],
    scale: 0.8,
    description: "Cá ngựa cổ dài nhỏ xíu, bé cái giữ trứng trong bụng như một chiếc túi."
  },
  {
    id: "seashell",
    word: "Seashell",
    meaning: "Vỏ sò",
    pronunciation: "/ˈsiːʃɛl/",
    example: "The shiny seashell lies on the sand.",
    translation: "Chiếc vỏ sò bóng loáng nằm trên bãi cát. ",
    category: "sea",
    color: "#FCD34D",
    emoji: "🐚",
    position: [1.8, 0.26, -1.7],
    scale: 0.8,
    description: "Vỏ sò giòn nhẹ, thường được thu thập khi đi dạo bờ biển."
  },
  {
    id: "coral",
    word: "Coral",
    meaning: "San hô",
    pronunciation: "/ˈkɒrəl/",
    example: "The colorful coral grows on the ocean floor.",
    translation: "San hô rực rỡ mọc dưới đáy biển. ",
    category: "sea",
    color: "#F472B6",
    emoji: "🪸",
    position: [-1.8, 0.25, -1.9],
    scale: 0.95,
    description: "San hô tạo ra thế giới rạn san hô lung linh dưới đáy biển."
  },
  {
    id: "lobster",
    word: "Lobster",
    meaning: "Con tôm hùm",
    pronunciation: "/ˈlɒbstər/",
    example: "The lobster waves its claws at the camera.",
    translation: "Con tôm hùm vẫy càng trước ống kính. ",
    category: "sea",
    color: "#EF4444",
    emoji: "🦞",
    position: [2.3, 0.4, 1.7],
    scale: 0.95,
    description: "Tôm hùm có càng lớn và vàng đỏ đẹp mắt, sống dưới đáy đại dương."
  },
  {
    id: "shark",
    word: "Shark",
    meaning: "Cá mập",
    pronunciation: "/ʃɑːrk/",
    example: "The shark swims quietly through the reef.",
    translation: "Cá mập lặng lẽ bơi qua rạn san hô. ",
    category: "sea",
    color: "#475569",
    emoji: "🦈",
    position: [-2.6, 0.6, -0.8],
    scale: 1.15,
    description: "Cá mập là bậc thầy săn mồi của biển xanh, di chuyển rất dứt khoát."
  },
  {
    id: "turtle-sea",
    word: "Sea Turtle",
    meaning: "Rùa biển",
    pronunciation: "/ˈsiː ˌtɜːrtl/",
    example: "The sea turtle glides gently near the coral.",
    translation: "Rùa biển lướt nhẹ nhàng gần rạn san hô. ",
    category: "sea",
    color: "#0F766E",
    emoji: "🐢",
    position: [0, 0.35, 2.3],
    scale: 1.0,
    description: "Rùa biển sống lâu năm, di chuyển chậm nhưng rất bền bỉ."
  },
  {
    id: "tiger",
    word: "Tiger",
    meaning: "Con hổ",
    pronunciation: "/ˈtaɪɡər/",
    example: "The tiger has beautiful orange stripes.",
    translation: "Con hổ có những vằn cam đẹp mắt. ",
    category: "animals",
    color: "#F59E0B",
    emoji: "🐯",
    position: [2.1, 0.85, -0.6],
    scale: 1.1,
    description: "Hổ là vua rừng xanh với bộ lông sọc cam đen vô cùng ấn tượng."
  },
  {
    id: "kangaroo",
    word: "Kangaroo",
    meaning: "Con chuột túi",
    pronunciation: "/ˌkæŋɡəˈruː/",
    example: "The kangaroo carries her baby in her pouch.",
    translation: "Chuột túi mang con trong túi sau bụng. ",
    category: "animals",
    color: "#D97706",
    emoji: "🦘",
    position: [1.8, 0.9, 1.5],
    scale: 1.05,
    description: "Chuột túi nhảy bồng bềnh và luôn có chiếc túi ấm cho bé con."
  },
  {
    id: "hippo",
    word: "Hippo",
    meaning: "Hà mã",
    pronunciation: "/ˈhɪpoʊ/",
    example: "The hippo splashes water with a big yawn.",
    translation: "Hà mã vẫy nước và ngáp thật to. ",
    category: "animals",
    color: "#64748B",
    emoji: "🦛",
    position: [-2.1, 0.6, -0.5],
    scale: 1.25,
    description: "Hà mã lớn, sống phần lớn thời gian trong nước để giữ thân mát."
  },
  {
    id: "rhino",
    word: "Rhino",
    meaning: "Tê giác",
    pronunciation: "/ˈraɪnoʊ/",
    example: "The big rhino has a strong horn on its nose.",
    translation: "Tê giác to lớn có sừng cứng trên mũi. ",
    category: "animals",
    color: "#94A3B8",
    emoji: "🦏",
    position: [0, 0.8, 1.9],
    scale: 1.15,
    description: "Tê giác có làn da dày như áo giáp và chiếc sừng mạnh mẽ."
  },
  {
    id: "fox",
    word: "Fox",
    meaning: "Cáo",
    pronunciation: "/fɒks/",
    example: "The clever fox hides behind the bushes.",
    translation: "Con cáo thông minh núp sau bụi cây. ",
    category: "animals",
    color: "#F97316",
    emoji: "🦊",
    position: [2.3, 0.5, 0.9],
    scale: 0.95,
    description: "Cáo nhanh nhẹn có bộ lông đỏ cam và đôi tai nhọn tinh tường."
  },
  {
    id: "owl",
    word: "Owl",
    meaning: "Con cú",
    pronunciation: "/aʊl/",
    example: "The wise owl watches quietly at night.",
    translation: "Con cú thông thái lặng lẽ quan sát ban đêm. ",
    category: "animals",
    color: "#A78BFA",
    emoji: "🦉",
    position: [-1.8, 0.75, 1.3],
    scale: 0.95,
    description: "Cú có đôi mắt to và tiếng kêu vang, thường xuất hiện khi trời tối."
  },
  {
    id: "crocodile",
    word: "Crocodile",
    meaning: "Cá sấu",
    pronunciation: "/ˈkrɒkəˌdaɪl/",
    example: "The crocodile rests on the riverbank with its mouth open.",
    translation: "Cá sấu nằm nghỉ bên bờ sông với miệng há. ",
    category: "animals",
    color: "#15803D",
    emoji: "🐊",
    position: [0.8, 0.45, -1.9],
    scale: 1.05,
    description: "Cá sấu có hàm răng sắc nhọn và chiếc đuôi mạnh mẽ để bơi lội."
  },
  {
    id: "panda",
    word: "Panda",
    meaning: "Gấu trúc",
    pronunciation: "/ˈpændə/",
    example: "The fluffy panda eats bamboo happily.",
    translation: "Gấu trúc lông xù thích ăn tre thơm ngon. ",
    category: "animals",
    color: "#1F2937",
    emoji: "🐼",
    position: [-1.2, 0.65, -1.9],
    scale: 1.1,
    description: "Gấu trúc đen trắng dễ thương thường sống yên bình trong rừng tre."
  }
];

// If user-modified vocabulary exists in localStorage, load it and replace the default array contents
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("s_vocab");
    if (stored) {
      const parsed = JSON.parse(stored) as VocabularyWord[];
      if (Array.isArray(parsed)) {
        VOCABULARY_DATA.length = 0;
        parsed.forEach((w) => VOCABULARY_DATA.push(w));
      }
    }
  } catch (e) {
    console.warn("Failed to load stored vocabulary", e);
  }
}

export const useStore = create<AppState>((set, get) => ({
  currentWord: null,
  learnedWordIds: typeof window !== "undefined" ? (() => {
    try {
      return JSON.parse(localStorage.getItem("s_learned_words") || "[]");
    } catch {
      return [];
    }
  })() : [],
  stars: typeof window !== "undefined" ? Number(localStorage.getItem("s_stars") || "12") : 12,
  soundEnabled: true,
  activeCategory: null, // Initially in World Map
  viewingMap: true,
  rewardsModalOpen: false,
  showUnlockNotification: false,
  hasSeenChestUnlock: false,
  isAuthenticated: typeof window !== "undefined" ? localStorage.getItem("s_authenticated") === "true" : false,
  currentUser: typeof window !== "undefined" ? (() => {
    try {
      return JSON.parse(localStorage.getItem("s_current_user") || "null");
    } catch {
      return null;
    }
  })() : null,
  users: typeof window !== "undefined" ? (() => {
    try {
      const storedUsers = localStorage.getItem("s_users");
      return storedUsers ? JSON.parse(storedUsers) : [{ username: "admin", email: "admin@smartexplorer.com", password: "admin123", role: "admin" }];
    } catch {
      return [{ username: "admin", email: "admin@smartexplorer.com", password: "admin123", role: "admin" }];
    }
  })() : [{ username: "admin", email: "admin@smartexplorer.com", password: "admin123", role: "admin" }],
  authModalOpen: false,
  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
  // expose vocabulary in state so components react to changes
  vocab: typeof VOCABULARY_DATA !== "undefined" ? [...VOCABULARY_DATA] : [],
  
  // Toasts
  toasts: [],
  showToast: (message, subMessage, emoji = "✨", type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, subMessage, emoji, type };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    
    // Auto-remove toast after 4.5 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, 4500);
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  login: (username, password) => {
    const existingUser = get().users.find((user) => user.username === username);
    if (!existingUser) {
      return "Tài khoản không tồn tại.";
    }
    if (existingUser.password !== password) {
      return "Sai mật khẩu. Vui lòng thử lại.";
    }

    set({ isAuthenticated: true, currentUser: existingUser, authModalOpen: false });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_authenticated", "true");
      localStorage.setItem("s_current_user", JSON.stringify(existingUser));
    }

    get().showToast(
      `Chào mừng ${existingUser.username}!`,
      "Đăng nhập thành công. Chúc bé học thật vui!",
      "👋",
      "success"
    );

    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, currentUser: null });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_authenticated", "false");
      localStorage.removeItem("s_current_user");
    }
  },

  register: (username, email, password) => {
    if (!username || !email || !password) {
      return "Vui lòng điền đầy đủ thông tin.";
    }
    const existingUser = get().users.some((user) => user.username === username);
    if (existingUser) {
      return "Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.";
    }

    const newUser = { username, email, password, role: "user" as const };
    const nextUsers = [...get().users, newUser];
    set({ users: nextUsers, isAuthenticated: true, currentUser: newUser, authModalOpen: false });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_users", JSON.stringify(nextUsers));
      localStorage.setItem("s_authenticated", "true");
      localStorage.setItem("s_current_user", JSON.stringify(newUser));
    }

    get().showToast(
      "Đăng ký thành công!",
      "Tài khoản mới đã được tạo và đăng nhập tự động.",
      "🎉",
      "success"
    );

    return true;
  },

  deleteUser: (username) => {
    const nextUsers = get().users.filter((user) => user.username !== username);
    set({ users: nextUsers });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_users", JSON.stringify(nextUsers));
    }

    const current = get().currentUser;
    if (current?.username === username) {
      set({ isAuthenticated: false, currentUser: null });
      if (typeof window !== "undefined") {
        localStorage.setItem("s_authenticated", "false");
        localStorage.removeItem("s_current_user");
      }
    }
  },

  // Vocabulary management (admin)
  addWord: (word: VocabularyWord) => {
    // ensure unique id
    const exists = VOCABULARY_DATA.some((w) => w.id === word.id);
    if (exists) return false;
    VOCABULARY_DATA.push(word);
    if (typeof window !== "undefined") localStorage.setItem("s_vocab", JSON.stringify(VOCABULARY_DATA));
    set({ vocab: [...VOCABULARY_DATA] });
    return true;
  },

  updateWord: (word: VocabularyWord) => {
    const idx = VOCABULARY_DATA.findIndex((w) => w.id === word.id);
    if (idx === -1) return false;
    VOCABULARY_DATA[idx] = word;
    if (typeof window !== "undefined") localStorage.setItem("s_vocab", JSON.stringify(VOCABULARY_DATA));
    set({ vocab: [...VOCABULARY_DATA] });
    return true;
  },

  deleteWord: (id: string) => {
    const idx = VOCABULARY_DATA.findIndex((w) => w.id === id);
    if (idx === -1) return false;
    VOCABULARY_DATA.splice(idx, 1);
    if (typeof window !== "undefined") localStorage.setItem("s_vocab", JSON.stringify(VOCABULARY_DATA));
    set({ vocab: [...VOCABULARY_DATA] });
    return true;
  },

  // Particles trigger
  lastLearnedWordId: null,
  clearLastLearnedWordId: () => {
    set({ lastLearnedWordId: null });
  },
  
  // Milestones
  achievedMilestones: typeof window !== "undefined" ? (() => {
    try {
      return JSON.parse(localStorage.getItem("s_milestones") || "[]");
    } catch {
      return [];
    }
  })() : [],
  
  // Quiz score tracker
  quizScore: 0,
  incrementQuizScore: () => set((state) => ({ quizScore: state.quizScore + 1 })),
  resetQuizScore: () => set({ quizScore: 0 }),
  
  challengeEnabled: typeof window !== "undefined" && localStorage.getItem("s_challenge") === "true",
  funModeEnabled: typeof window !== "undefined" && localStorage.getItem("s_funmode") === "true",
  narrativeModeEnabled: typeof window !== "undefined" ? localStorage.getItem("s_narrative") !== "false" : true,
  loginStreak: typeof window !== "undefined" ? Number(localStorage.getItem("s_streak") || "1") : 1,
  lastLoginDate: typeof window !== "undefined" ? localStorage.getItem("s_last_login") : null,
  immersive3D: false,
  environmentTheme: typeof window !== "undefined" ? (localStorage.getItem("s_env_theme") as "day" | "night" | "twilight" || "day") : "day",
  skyboxBackground: typeof window !== "undefined" ? (localStorage.getItem("s_skybox") as "plain" | "mountain" | "underwater" | "space" || "plain") : "plain",

  // 3D Drawing Board State
  drawingModeEnabled: false,
  activeDrawingTool: "free",
  activeDrawingColor: "#EF4444",
  activeBrushSize: 0.25,
  currentDrawingElements: [],
  savedDrawings: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("s_drawings") || "[]") : [],

  selectWord: (word: VocabularyWord) => {
    const { soundEnabled, learnedWordIds, narrativeModeEnabled } = get();
    set({ currentWord: word });
    
    // Play storytelling narrative speech or standard pronunciation
    if (narrativeModeEnabled) {
      speakSharedNarrative(word.word, word.meaning, word.description || "", soundEnabled);
    } else {
      speakEnglish(word.word, soundEnabled);
    }
    
    // If it's the first time learning this word, trigger milestone rewards!
    if (!learnedWordIds.includes(word.id)) {
      get().learnWord(word.id);
    } else {
      // Avoid pop overlapping narrative story introduction
      if (!narrativeModeEnabled) {
        playPopSound(soundEnabled);
      }
    }
  },

  closeWordCard: () => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ currentWord: null });
  },

  learnWord: (wordId: string) => {
    const { soundEnabled, learnedWordIds } = get();
    const newLearned = [...learnedWordIds, wordId];
    
    set({ 
      learnedWordIds: newLearned,
      lastLearnedWordId: wordId
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_learned_words", JSON.stringify(newLearned));
    }
    
    // Award a glowing bonus star!
    get().addStar(2);
    
    // Show learned word popup toast
    const learnedWord = VOCABULARY_DATA.find(w => w.id === wordId);
    if (learnedWord) {
      get().showToast(
        `Đã Thuộc Từ! +2 ★`,
        `Chúc mừng bé đã ghi nhớ từ "${learnedWord.word}" (${learnedWord.meaning})!`,
        learnedWord.emoji,
        "success"
      );
    }
    
    // Play celebratory sparkle chime
    setTimeout(() => {
      playSparkleSound(soundEnabled);
    }, 400);

    // Track milestones
    if (learnedWord) {
      const category = learnedWord.category;
      const categoryWords = VOCABULARY_DATA.filter(w => w.category === category);
      const learnedInCategory = categoryWords.filter(w => newLearned.includes(w.id)).length;
      const percentage = categoryWords.length > 0 ? Math.round((learnedInCategory / categoryWords.length) * 100) : 0;
      
      const milestoneThresholds = [50, 75, 100];
      for (const threshold of milestoneThresholds) {
        if (percentage >= threshold) {
          const milestoneKey = `${category}-${threshold}`;
          const currentMilestones = get().achievedMilestones;
          if (!currentMilestones.includes(milestoneKey)) {
            const nextMilestones = [...currentMilestones, milestoneKey];
            set({ achievedMilestones: nextMilestones });
            if (typeof window !== "undefined") {
              localStorage.setItem("s_milestones", JSON.stringify(nextMilestones));
            }
            
            // Map localized name
            const catNames: Record<string, string> = {
              garden: "Vườn Trái Cây",
              pet: "Nhà Thú Cưng",
              sea: "Đại Dương Xanh",
              animals: "Thú Hoang Dã"
            };
            const catName = catNames[category] || category;
            const starReward = threshold === 50 ? 10 : threshold === 75 ? 15 : 25;
            
            // Add bonus stars and toast
            setTimeout(() => {
              get().addStar(starReward);
              get().showToast(
                `Mốc Mới: Vùng Đất ${threshold}%!`,
                `Bé mở khóa mốc hoàn thành ${threshold}% vùng "${catName}"! Nhận thưởng +${starReward} ★`,
                threshold === 100 ? "🏆" : threshold === 75 ? "⭐" : "✨",
                "milestone"
              );
              playSparkleSound(get().soundEnabled);
            }, 900);
          }
        }
      }
    }
  },

  toggleSound: () => {
    const nextVal = !get().soundEnabled;
    const activeCat = get().activeCategory;
    set({ soundEnabled: nextVal });
    
    if (nextVal) {
      if (activeCat) {
        startAmbientSound(activeCat, true);
      }
      setTimeout(() => {
        playClickSound(true);
      }, 50);
    } else {
      stopAmbientSound();
    }
  },

  toggleChallenge: () => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    const nextVal = !get().challengeEnabled;
    set({ challengeEnabled: nextVal });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_challenge", String(nextVal));
    }
  },

  toggleFunMode: () => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    const nextVal = !get().funModeEnabled;
    set({ funModeEnabled: nextVal });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_funmode", String(nextVal));
    }
  },

  toggleNarrativeMode: () => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    const nextVal = !get().narrativeModeEnabled;
    set({ narrativeModeEnabled: nextVal });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_narrative", String(nextVal));
    }
    const title = nextVal ? "Mở Chế Độ Dẫn Chuyện 📚" : "Tắt Chế Độ Dẫn Chuyện 🎙️";
    const sub = nextVal ? "Khi bé nhấn vật 3D, Cô Giáo AI sẽ kể những câu chuyện siêu thú vị về bạn nhỏ đó nha!" : "Chuyển sang chỉ phát âm từ tiếng Anh tinh giản thui nha bé!";
    const emoji = nextVal ? "📖" : "🎙️";
    get().showToast(title, sub, emoji, "success");
    
    if (!nextVal && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },

  toggleImmersive3D: () => {
    const { soundEnabled, immersive3D } = get();
    playClickSound(soundEnabled);
    set({ immersive3D: !immersive3D });
  },

  setEnvironmentTheme: (theme) => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ environmentTheme: theme });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_env_theme", theme);
    }
    const emoji = theme === "day" ? "☀️" : theme === "night" ? "🌙" : "🌇";
    const title = theme === "day" ? "Bầu trời Ban Ngày ☀️" : theme === "night" ? "Bầu trời Ban Đêm 🌙" : "Cảnh Hoàng Hôn 🌇";
    const sub = theme === "day" ? "Bầu trời sáng bừng rực rỡ nắng ấm áp cho bé vẽ tranh!" : theme === "night" ? "Màn đêm huyền bí, lấp lánh ngàn sao lung linh đã xuất hiện!" : "Ráng chiều ấm áp, mơ mộng cực kỳ đẹp và yên bình bé yêu ơi!";
    get().showToast(title, sub, emoji, "success");
  },

  setSkyboxBackground: (bg) => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ skyboxBackground: bg });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_skybox", bg);
    }
    const emoji = bg === "plain" ? "🎨" : bg === "mountain" ? "⛰️" : bg === "underwater" ? "🐠" : "🚀";
    const title = bg === "plain" ? "Nền Đơn Sắc 🎨" : bg === "mountain" ? "Nền Núi Non ⛰️" : bg === "underwater" ? "Vực Thẳm Đại Dương 🐠" : "Vũ Trụ Bao La 🚀";
    const sub = bg === "plain" ? "Đã chuyển sang nền màu trơn dịu mắt!" : bg === "mountain" ? "Bé đang ở vùng núi đồi xanh mát thơ mộng rồi!" : bg === "underwater" ? "Khám phá đại dương sâu thẳm lấp lánh bong bóng!" : "Khám phá không gian vũ trụ huyền bí đầy kỳ thú!";
    get().showToast(title, sub, emoji, "success");
  },

  toggleDrawingMode: () => {
    const { soundEnabled, drawingModeEnabled, currentWord } = get();
    playClickSound(soundEnabled);
    set({ 
      drawingModeEnabled: !drawingModeEnabled,
      currentWord: drawingModeEnabled ? currentWord : null 
    });
  },
  
  setDrawingTool: (tool) => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ activeDrawingTool: tool });
  },
  
  setDrawingColor: (color) => {
    set({ activeDrawingColor: color });
  },
  
  setBrushSize: (size) => {
    set({ activeBrushSize: size });
  },
  
  addDrawingElement: (element) => {
    const { currentDrawingElements, activeCategory } = get();
    const nextElements = [...currentDrawingElements, element];
    set({ currentDrawingElements: nextElements });
    
    if (activeCategory && typeof window !== "undefined") {
      localStorage.setItem(`s_drawing_elements_${activeCategory}`, JSON.stringify(nextElements));
    }
  },
  
  setDrawingElements: (elements) => {
    const { activeCategory } = get();
    set({ currentDrawingElements: elements });
    if (activeCategory && typeof window !== "undefined") {
      localStorage.setItem(`s_drawing_elements_${activeCategory}`, JSON.stringify(elements));
    }
  },
  
  clearDrawing: () => {
    const { soundEnabled, activeCategory } = get();
    playPopSound(soundEnabled);
    set({ currentDrawingElements: [] });
    if (activeCategory && typeof window !== "undefined") {
      localStorage.removeItem(`s_drawing_elements_${activeCategory}`);
    }
    get().showToast("Đã dọn bảng vẽ", "Bé có thể bắt đầu vẽ một tác phẩm sắc màu mới nhé! 🎨", "🧹", "success");
  },
  
  saveCurrentDrawing: (name, thumbnail) => {
    const { currentDrawingElements, activeCategory, savedDrawings, soundEnabled } = get();
    if (!activeCategory || currentDrawingElements.length === 0) return;
    
    const newSaved = {
      id: Math.random().toString(36).substring(2, 9),
      name: name || `Vùng đất nhiệm màu của bé`,
      dateTime: new Date().toLocaleDateString("vi-VN") + " - " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      category: activeCategory,
      elements: [...currentDrawingElements],
      thumbnail: thumbnail
    };
    
    const nextSaved = [newSaved, ...savedDrawings];
    set({ savedDrawings: nextSaved });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_drawings", JSON.stringify(nextSaved));
    }
    
    get().addStar(10);
    get().showToast(
      "Đã Lưu Tác Phẩm! +10 ★",
      `Tác phẩm "${newSaved.name}" đã lưu thành công trong bộ sưu tập 3D của bé!`,
      "🖼️",
      "success"
    );
    playSparkleSound(soundEnabled);
  },
  
  loadSavedDrawing: (drawingId) => {
    const { savedDrawings, activeCategory, soundEnabled } = get();
    const drawing = savedDrawings.find(d => d.id === drawingId);
    if (drawing) {
      playClickSound(soundEnabled);
      set({ currentDrawingElements: drawing.elements });
      if (activeCategory && typeof window !== "undefined") {
        localStorage.setItem(`s_drawing_elements_${activeCategory}`, JSON.stringify(drawing.elements));
      }
      get().showToast("Đã tải tác phẩm", `Vừa mở tác phẩm "${drawing.name}" của bé!`, "🎨", "success");
    }
  },
  
  deleteSavedDrawing: (drawingId) => {
    const { savedDrawings, soundEnabled } = get();
    playPopSound(soundEnabled);
    const nextSaved = savedDrawings.filter(d => d.id !== drawingId);
    set({ savedDrawings: nextSaved });
    if (typeof window !== "undefined") {
      localStorage.setItem("s_drawings", JSON.stringify(nextSaved));
    }
    get().showToast("Đã xóa tác phẩm", "Tác phẩm xuất sắc đã dọn sạch khỏi danh sách.", "🗑️", "success");
  },

  loadSharedDrawing: (category, elements) => {
    const { soundEnabled } = get();
    playSparkleSound(soundEnabled);
    
    // Stop old ambient sound, play new one
    stopAmbientSound();
    if (category) {
      startAmbientSound(category, soundEnabled);
    }
    
    set({
      activeCategory: category,
      viewingMap: false,
      immersive3D: false,
      drawingModeEnabled: true,
      currentDrawingElements: elements,
      currentWord: null
    });
    
    if (typeof window !== "undefined" && category) {
      localStorage.setItem(`s_drawing_elements_${category}`, JSON.stringify(elements));
    }
    
    get().showToast(
      "Đã tải tranh kỳ diệu! 🌟",
      "Vừa mở tác phẩm lấp lánh mà bé nhận được từ bạn nhỏ khác đấy! Nhấn 'Bộ Sưu Tập' để lưu lại nhé!",
      "🎁",
      "success"
    );
  },

  setCategory: (category: ExploreCategory | null) => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    // Require authentication when entering a content category
    if (category && !get().isAuthenticated) {
      get().showToast("Yêu cầu đăng nhập", "Vui lòng đăng nhập để vào phần học.", "🔒", "success");
      set({ authModalOpen: true });
      return;
    }

    if (category) {
      startAmbientSound(category, soundEnabled);
    } else {
      stopAmbientSound();
    }

    // Load active drawing for this category if switching to a category
    let categoryElements = [];
    if (category && typeof window !== "undefined") {
      const saved = localStorage.getItem(`s_drawing_elements_${category}`);
      if (saved) {
        try {
          categoryElements = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }

    set({ 
      activeCategory: category,
      viewingMap: category === null,
      currentWord: null, // clear focus card on scene change
      immersive3D: false,
      drawingModeEnabled: false,
      currentDrawingElements: categoryElements
    });
  },

  addStar: (amount: number) => {
    set((state) => {
      const nextStars = state.stars + amount;
      if (typeof window !== "undefined") {
        localStorage.setItem("s_stars", String(nextStars));
      }
      const nextScore = nextStars * 10;
      const willUnlock = nextScore >= 500 && !state.hasSeenChestUnlock;
      
      return { 
        stars: nextStars,
        showUnlockNotification: willUnlock ? true : state.showUnlockNotification,
        hasSeenChestUnlock: willUnlock ? true : state.hasSeenChestUnlock
      };
    });
  },

  resetProgress: () => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    stopAmbientSound();
    if (typeof window !== "undefined") {
      localStorage.removeItem("s_challenge");
      localStorage.removeItem("s_funmode");
      localStorage.removeItem("s_narrative");
      localStorage.removeItem("s_streak");
      localStorage.removeItem("s_last_login");
      localStorage.removeItem("s_drawings");
      localStorage.removeItem("s_drawing_elements_garden");
      localStorage.removeItem("s_drawing_elements_pet");
      localStorage.removeItem("s_drawing_elements_sea");
      localStorage.removeItem("s_drawing_elements_animals");
      localStorage.removeItem("s_env_theme");
      localStorage.removeItem("s_skybox");
      localStorage.removeItem("s_learned_words");
      localStorage.removeItem("s_stars");
      localStorage.removeItem("s_milestones");
    }
    set({
      stars: 0,
      learnedWordIds: [],
      currentWord: null,
      activeCategory: null,
      viewingMap: true,
      rewardsModalOpen: false,
      showUnlockNotification: false,
      hasSeenChestUnlock: false,
      challengeEnabled: false,
      funModeEnabled: false,
      narrativeModeEnabled: true,
      loginStreak: 1,
      lastLoginDate: null,
      immersive3D: false,
      environmentTheme: "day",
      skyboxBackground: "plain",
      toasts: [],
      quizScore: 0,
      achievedMilestones: [],
      lastLearnedWordId: null,
      drawingModeEnabled: false,
      activeDrawingTool: "free",
      activeDrawingColor: "#EF4444",
      activeBrushSize: 0.25,
      currentDrawingElements: [],
      savedDrawings: []
    });
  },

  setRewardsModalOpen: (open: boolean) => {
    const { soundEnabled } = get();
    playClickSound(soundEnabled);
    set({ rewardsModalOpen: open });
  },

  setShowUnlockNotification: (show: boolean) => {
    set({ showUnlockNotification: show });
  },

  setSeenChestUnlock: (seen: boolean) => {
    set({ hasSeenChestUnlock: seen });
  },

  checkLoginStreak: () => {
    if (typeof window === "undefined") return;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const lastLogin = get().lastLoginDate;
    const currentStreak = get().loginStreak;

    if (!lastLogin) {
      set({ loginStreak: 1, lastLoginDate: todayStr });
      localStorage.setItem("s_streak", "1");
      localStorage.setItem("s_last_login", todayStr);
      return;
    }

    if (lastLogin === todayStr) {
      return;
    }

    const prevDate = new Date(lastLogin);
    const currDate = new Date(todayStr);
    
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      const nextStreak = currentStreak + 1;
      set({ loginStreak: nextStreak, lastLoginDate: todayStr });
      localStorage.setItem("s_streak", String(nextStreak));
      localStorage.setItem("s_last_login", todayStr);
      
      setTimeout(() => {
        get().addStar(1); // Give +10 points to start off
      }, 500);
    } else if (diffDays > 1) {
      set({ loginStreak: 1, lastLoginDate: todayStr });
      localStorage.setItem("s_streak", "1");
      localStorage.setItem("s_last_login", todayStr);
    }
  }
}));
