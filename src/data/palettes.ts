export interface Palette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  colorNames?: string[];
  headingFont?: string;
  bodyFont?: string;
}

export const PALETTES: Palette[] = [
  { id: '1', name: 'Stormy Night', colors: ['#0b1622', '#082531', '#547677', '#80b8b5', '#cbd3d2'], tags: ['Dark', 'Cool', 'Muted'] },
  { id: '2', name: 'Ocean Breeze', colors: ['#042f2e', '#0f766e', '#14b8a6', '#5eead4', '#ccfbf1'], tags: ['Cool', 'Vibrant', 'Light'] },
  { id: '3', name: 'Cyberpunk', colors: ['#1e1b4b', '#4c1d95', '#7c3aed', '#c084fc', '#f3e8ff'], tags: ['Dark', 'Neon', 'Vibrant'] },
  { id: '4', name: 'Sunset Glow', colors: ['#450a0a', '#991b1b', '#ef4444', '#fb923c', '#ffedd5'], tags: ['Warm', 'Vibrant', 'Earth'] },
  { id: '5', name: 'Neon Dreams', colors: ['#020617', '#0f172a', '#3b82f6', '#f43f5e', '#f8fafc'], tags: ['Dark', 'Neon', 'Cool'] },
  { id: '6', name: 'Midnight Mint', colors: ['#022c22', '#064e3b', '#059669', '#34d399', '#ecfdf5'], tags: ['Dark', 'Cool', 'Earth'] },
  { id: '7', name: 'Pastel Dream', colors: ['#4c1d95', '#a78bfa', '#f472b6', '#fbcfe8', '#fdf2f8'], tags: ['Pastel', 'Light', 'Warm'] },
  { id: '8', name: 'Desert Sand', colors: ['#451a03', '#78350f', '#b45309', '#f59e0b', '#fef3c7'], tags: ['Warm', 'Earth', 'Light'] },
  { id: '9', name: 'Autumn Leaves', colors: ['#3f2723', '#bf360c', '#e64a19', '#ff7043', '#fbe9e7'], tags: ['Warm', 'Earth', 'Muted'] },
  { id: '10', name: 'High Contrast', colors: ['#000000', '#1a1a1a', '#e11d48', '#e5e5e5', '#ffffff'], tags: ['Dark', 'Light', 'Monochrome'] },
  { id: '11', name: 'Royal Velvet', colors: ['#2e1065', '#4c1d95', '#6d28d9', '#a78bfa', '#f3e8ff'], tags: ['Dark', 'Cool', 'Vibrant'] },
  { 
    id: '12', 
    name: 'Antique Rose', 
    colors: ['#48342c', '#9c7164', '#c38380', '#d8b69f', '#e8e1d1'], 
    tags: ['Aesthetic', 'Warm', 'Vintage'],
    colorNames: ['Deep Umber', 'Rose Taupe', 'Rosy Blush', 'Soft Peach', 'Antique Lace'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '13',
    name: 'Sage & Terracotta',
    colors: ['#2d3a2e', '#7a9e7e', '#c97c5d', '#e8c4a0', '#f5f0e8'],
    tags: ['Aesthetic', 'Earth', 'Warm'],
    colorNames: ['Forest Shadow', 'Sage Green', 'Terracotta', 'Warm Sand', 'Ivory Mist'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter'
  },
  {
    id: '14',
    name: 'Midnight Lavender',
    colors: ['#1a1a2e', '#4a3f6b', '#8b6bb1', '#c4a8d4', '#f0e8f5'],
    tags: ['Aesthetic', 'Dark', 'Cool'],
    colorNames: ['Midnight Navy', 'Deep Violet', 'Soft Amethyst', 'Lilac Mist', 'Lavender Bloom'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '15',
    name: 'Nordic Fjord',
    colors: ['#1c2b3a', '#2e6b8a', '#5ba4c7', '#a8d4e8', '#e8f4f8'],
    tags: ['Cool', 'Muted', 'Light'],
    colorNames: ['Deep Ocean', 'Nordic Blue', 'Glacial Water', 'Arctic Sky', 'Ice White'],
    headingFont: 'Outfit',
    bodyFont: 'Inter'
  },
  {
    id: '16',
    name: 'Mocha Marble',
    colors: ['#2c1a0e', '#7c5c3e', '#b08860', '#d4b896', '#f2ece4'],
    tags: ['Warm', 'Earth', 'Aesthetic'],
    colorNames: ['Espresso', 'Walnut Brown', 'Caramel', 'Latte Foam', 'Cream Marble'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '17',
    name: 'Cherry Blossom',
    colors: ['#3d1c2e', '#8b3a5a', '#e87fa0', '#f5c4d4', '#fef5f7'],
    tags: ['Pastel', 'Warm', 'Aesthetic'],
    colorNames: ['Plum Night', 'Deep Magenta', 'Blossom Pink', 'Petal Blush', 'Petal White'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter'
  },
  {
    id: '18',
    name: 'Jungle Canopy',
    colors: ['#1a2e1e', '#2d6a3f', '#5a9e6e', '#96c9a5', '#e4f3e8'],
    tags: ['Dark', 'Earth', 'Cool'],
    colorNames: ['Deep Jungle', 'Forest Floor', 'Fern Green', 'Moss Mist', 'Morning Dew'],
    headingFont: 'Outfit',
    bodyFont: 'Inter'
  },
  {
    id: '19',
    name: 'Golden Dusk',
    colors: ['#2e1c0a', '#8b5a1a', '#d4914a', '#e8c28a', '#fdf4e3'],
    tags: ['Warm', 'Vibrant', 'Aesthetic'],
    colorNames: ['Dark Mahogany', 'Amber Wood', 'Golden Hour', 'Honey Glow', 'Warm Parchment'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '20',
    name: 'Coastal Fog',
    colors: ['#2a3540', '#4a6274', '#7a9bab', '#b0c8d4', '#e8f2f6'],
    tags: ['Muted', 'Cool', 'Light'],
    colorNames: ['Storm Cloud', 'Slate Blue', 'Sea Mist', 'Morning Fog', 'Coastal Pearl'],
    headingFont: 'Outfit',
    bodyFont: 'Inter'
  },
  {
    id: '21',
    name: 'Desert Bloom',
    colors: ['#3d2414', '#a0522d', '#e8935a', '#f5c89c', '#fff0e0'],
    tags: ['Warm', 'Earth', 'Vibrant'],
    colorNames: ['Burnt Sienna', 'Rust Clay', 'Papaya Sorbet', 'Peach Nectar', 'Desert Sand'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter'
  },
  {
    id: '22',
    name: 'Ink & Parchment',
    colors: ['#1a1410', '#4a3728', '#8b7355', '#c4b090', '#f5f0e8'],
    tags: ['Warm', 'Muted', 'Aesthetic'],
    colorNames: ['Black Ink', 'Dark Walnut', 'Aged Bronze', 'Antique Gold', 'Parchment'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '23',
    name: 'Aurora Borealis',
    colors: ['#0a1628', '#1a4a6e', '#2e8b8f', '#5ec4a8', '#d4f0e8'],
    tags: ['Dark', 'Cool', 'Vibrant'],
    colorNames: ['Arctic Night', 'Deep Teal', 'Glacial Jade', 'Aurora Mint', 'Northern Light'],
    headingFont: 'Outfit',
    bodyFont: 'Inter'
  },
  {
    id: '24',
    name: 'Wine & Roses',
    colors: ['#3b0a1e', '#8b2252', '#c45e82', '#e8a8bc', '#fde8ef'],
    tags: ['Warm', 'Vibrant', 'Aesthetic'],
    colorNames: ['Deep Wine', 'Burgundy Rose', 'Blush Coral', 'Rose Petal', 'Champagne Pink'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Lato'
  },
  {
    id: '25',
    name: 'Dusty Botanicals',
    colors: ['#81785a', '#919d85', '#8e88a3', '#c496a1', '#ebe1c6'],
    tags: ['Aesthetic', 'Muted', 'Vintage'],
    colorNames: ['Antique Bronze', 'Muted Sage', 'Lavender Purple', 'Dusty Rose', 'Vintage Cream'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Lato'
  },
  {
    id: '26',
    name: 'Lilac & Sage',
    colors: ['#acb087', '#ae99b2', '#f4dfcc', '#fae1e0', '#f8c8d4'],
    tags: ['Aesthetic', 'Pastel', 'Light'],
    colorNames: ['Sage', 'Lilac', 'Icing', 'Ivory', 'Blush'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '27',
    name: 'Olive & Mauve',
    colors: ['#3d3b2f', '#7a7a5a', '#b5a68c', '#c9a0b0', '#ede4db'],
    tags: ['Aesthetic', 'Earth', 'Muted'],
    colorNames: ['Dark Olive', 'Willow Green', 'Sandstone', 'Mauve Mist', 'Bone White'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter'
  },
  {
    id: '28',
    name: 'Soft Petal',
    colors: ['#6b4c5a', '#c4889a', '#e8b4b8', '#f2d5c4', '#faf3ed'],
    tags: ['Aesthetic', 'Pastel', 'Warm'],
    colorNames: ['Plum Dust', 'Rose Garden', 'Blush Petal', 'Apricot Silk', 'Pearl Ivory'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '29',
    name: 'Eucalyptus Dream',
    colors: ['#2e4a3e', '#688b72', '#a8c4a2', '#d4dcc8', '#f0ede4'],
    tags: ['Aesthetic', 'Cool', 'Earth'],
    colorNames: ['Deep Eucalyptus', 'Herb Garden', 'Sage Leaf', 'Meadow Dew', 'Soft Linen'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter'
  },
  {
    id: '30',
    name: 'Clay & Cream',
    colors: ['#5c3d2e', '#a67b5b', '#d4a574', '#e8d0b3', '#f8f2ea'],
    tags: ['Aesthetic', 'Warm', 'Earth'],
    colorNames: ['Raw Cocoa', 'Terracotta Clay', 'Honey Amber', 'Warm Bisque', 'French Cream'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  },
  {
    id: '31',
    name: 'Dusty Wisteria',
    colors: ['#3a2e4a', '#7b6b8a', '#b5a3c4', '#d8cce0', '#f2eef5'],
    tags: ['Aesthetic', 'Cool', 'Pastel'],
    colorNames: ['Midnight Violet', 'Dusky Plum', 'Wisteria', 'Lavender Haze', 'Cloud White'],
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter'
  },
  {
    id: '32',
    name: 'Blush & Olive',
    colors: ['#4a4a32', '#8a8a60', '#c8b4a0', '#e0c4b4', '#f5e8e0'],
    tags: ['Aesthetic', 'Warm', 'Vintage'],
    colorNames: ['Dark Olive', 'Dried Herb', 'Sandrose', 'Blush Beige', 'Whipped Cream'],
    headingFont: 'Playfair Display',
    bodyFont: 'Lato'
  }
];
