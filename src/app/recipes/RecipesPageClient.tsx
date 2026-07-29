'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categories = [
'Quick & Easy', 'Dinner', 'Breakfast', 'Baking', 'Healthy',
'Air Fryer', 'BBQ', 'Desserts', 'Global Flavors', 'Pasta', 'Soups', 'Vegetarian'];


const cuisineOptions = ['Any', 'Italian', 'Mexican', 'Japanese', 'Indian', 'Chinese', 'Mediterranean', 'American', 'Thai', 'Korean', 'Middle Eastern'];
const mealTypeOptions = ['Any', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drink'];
const timeOptions = ['Any', 'Under 15 min', 'Under 30 min', 'Under 1 hour', '1+ hours'];
const difficultyOptions = ['Any', 'Easy', 'Medium', 'Hard'];
const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Nut-Free'];

const featuredRecipe = {
  title: 'Crispy Honey Garlic Salmon',
  creator: 'Maria Chen',
  creatorHandle: '@mariachencooks',
  time: '25 min',
  difficulty: 'Easy',
  rating: 4.9,
  cooks: 3241,
  description: 'A weeknight hero — flaky salmon glazed with sticky honey garlic sauce, ready in under 30 minutes and guaranteed to impress.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13581a46c-1772646980537.png",
  alt: 'Golden crispy salmon fillet glazed with honey garlic sauce on a white plate with herbs',
  tags: ['Seafood', 'Quick', 'Healthy']
};

const trendingRecipes = [
{ title: 'Smash Burger Tacos', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', cooks: 8920, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1acf3cb0a-1772799442431.png", alt: 'Smash burger patty folded in a crispy taco shell with cheese and toppings', slug: 'smash-burger-tacos' },
{ title: 'One-Pan Lemon Orzo', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', cooks: 6104, image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927", alt: 'Creamy lemon orzo pasta with spinach and parmesan in a cast iron pan', slug: 'one-pan-lemon-orzo' },
{ title: 'Korean Corn Dogs', creator: 'Yuna Kim', time: '35 min', difficulty: 'Medium', cooks: 5432, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eead6026-1771887177210.png", alt: 'Korean-style corn dogs coated in crispy batter with sugar and ketchup drizzle', slug: 'korean-corn-dogs' },
{ title: 'Mango Coconut Chia Pudding', creator: 'Priya Nair', time: '10 min', difficulty: 'Easy', cooks: 4211, image: "https://images.unsplash.com/photo-1629180050285-7c56c6671f19", alt: 'Layered mango coconut chia pudding in a glass jar topped with fresh mango slices', slug: 'mango-coconut-chia-pudding' }];


const quickRecipes = [
{ title: 'Garlic Butter Shrimp Pasta', creator: 'Marco Rossi', time: '20 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f19f6fbe-1775504653966.png", alt: 'Garlic butter shrimp tossed with linguine pasta and fresh parsley', slug: 'garlic-butter-shrimp-pasta' },
{ title: 'Avocado Toast with Poached Egg', creator: 'Emma Walsh', time: '15 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18e6c1a9c-1772204197800.png", alt: 'Thick sourdough toast topped with smashed avocado and a perfectly poached egg', slug: 'avocado-toast-poached-egg' },
{ title: 'Spicy Peanut Noodles', creator: 'Lin Wei', time: '25 min', image: "https://images.unsplash.com/photo-1626066014976-cd53fe450b3e", alt: 'Cold spicy peanut noodles garnished with cucumber, scallions, and sesame seeds', slug: 'spicy-peanut-noodles' },
{ title: 'Sheet Pan Fajitas', creator: 'Carlos Mendez', time: '30 min', image: "https://images.unsplash.com/photo-1679060301613-2ff2050db858", alt: 'Colorful bell peppers and chicken strips roasted on a sheet pan for fajitas', slug: 'sheet-pan-fajitas' },
{ title: 'Caprese Salad', creator: 'Sofia Romano', time: '10 min', image: "https://images.unsplash.com/photo-1725464781841-2d6f9ac10fb2", alt: 'Classic caprese salad with fresh mozzarella, tomatoes, basil and balsamic glaze', slug: 'caprese-salad' },
{ title: 'Egg Fried Rice', creator: 'Lin Wei', time: '15 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_14631f803-1772367083673.png", alt: 'Wok-tossed egg fried rice with vegetables and soy sauce in a bowl', slug: 'egg-fried-rice' }];


const globalRecipes = [
{ title: 'Chicken Tikka Masala', creator: 'Aisha Sharma', cuisine: 'Indian', image: "https://images.unsplash.com/photo-1657205937641-01d8c906274f", alt: 'Rich and creamy chicken tikka masala in a bowl with naan bread on the side', slug: 'chicken-tikka-masala' },
{ title: 'Beef Pho', creator: 'Nguyen Lan', cuisine: 'Vietnamese', image: "https://images.unsplash.com/photo-1707153438523-3d32f2bed0f3", alt: 'Steaming bowl of Vietnamese beef pho with rice noodles, herbs, and bean sprouts', slug: 'beef-pho' },
{ title: 'Shakshuka', creator: 'Leila Hassan', cuisine: 'Middle Eastern', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e54a3842-1783627091192.png", alt: 'Eggs poached in spiced tomato and pepper sauce in a cast iron skillet', slug: 'shakshuka' },
{ title: 'Tacos al Pastor', creator: 'Rosa Gutierrez', cuisine: 'Mexican', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f6aa0250-1772893483543.png", alt: 'Authentic tacos al pastor with marinated pork, pineapple, cilantro, and onion', slug: 'tacos-al-pastor' },
{ title: 'Pad Thai', creator: 'Somchai Wongsa', cuisine: 'Thai', image: "https://images.unsplash.com/photo-1663905494561-f70d406eff0d", alt: 'Classic pad thai noodles with shrimp, bean sprouts, peanuts, and lime wedge', slug: 'pad-thai' },
{ title: 'Bibimbap', creator: 'Min-Jun Oh', cuisine: 'Korean', image: "https://images.unsplash.com/photo-1733231323270-82dd8a5efe4b", alt: 'Colorful Korean bibimbap bowl with rice, vegetables, egg, and gochujang sauce', slug: 'bibimbap' }];


const healthyRecipes = [
{ title: 'Rainbow Buddha Bowl', creator: 'Priya Nair', time: '20 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13da08aa3-1772139613628.png", alt: 'Colorful buddha bowl with roasted vegetables, quinoa, and tahini dressing', slug: 'rainbow-buddha-bowl' },
{ title: 'Zucchini Noodles with Pesto', creator: 'Emma Walsh', time: '15 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19ed2983c-1768144943727.png", alt: 'Spiralized zucchini noodles tossed with fresh basil pesto and cherry tomatoes', slug: 'zucchini-noodles-pesto' },
{ title: 'Grilled Chicken & Quinoa', creator: 'Sofia Patel', time: '30 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1105e39ee-1784981318339.png", alt: 'Grilled chicken breast sliced over fluffy quinoa with roasted vegetables', slug: 'grilled-chicken-quinoa' },
{ title: 'Berry Smoothie Bowl', creator: 'Aisha Sharma', time: '10 min', image: "https://images.unsplash.com/photo-1623783398179-078261d586d3", alt: 'Thick acai smoothie bowl topped with fresh berries, granola, and coconut flakes', slug: 'berry-smoothie-bowl' },
{ title: 'Salmon & Avocado Salad', creator: 'Maria Chen', time: '20 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1300967e4-1773173912136.png", alt: 'Fresh salmon salad with avocado, mixed greens, and lemon vinaigrette', slug: 'salmon-avocado-salad' },
{ title: 'Lentil Soup', creator: 'Leila Hassan', time: '35 min', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a176c584-1782375166859.png", alt: 'Hearty red lentil soup with cumin, turmeric, and fresh lemon in a bowl', slug: 'lentil-soup' }];


const familyRecipes = [
{ title: 'Sunday Pot Roast', creator: 'Marco Rossi', time: '3 hrs', image: "https://img.rocket.new/generatedImages/rocket_gen_img_118501734-1771898937177.png", alt: 'Slow-cooked pot roast with root vegetables in a Dutch oven', slug: 'sunday-pot-roast' },
{ title: "Grandma\'s Chicken Soup", creator: 'Rosa Gutierrez', time: '1.5 hrs', image: "https://images.unsplash.com/photo-1727417376054-a3a6d6f31999", alt: 'Hearty homemade chicken noodle soup with vegetables in a white bowl', slug: 'grandmas-chicken-soup' },
{ title: 'Classic Lasagna', creator: 'Maria Chen', time: '2 hrs', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18ea24141-1772646976917.png", alt: 'Layered classic lasagna with meat sauce and bubbling mozzarella cheese', slug: 'classic-lasagna' },
{ title: 'Apple Pie from Scratch', creator: 'Emma Walsh', time: '2.5 hrs', image: "https://images.unsplash.com/photo-1638329261528-1932b0e63212", alt: 'Golden homemade apple pie with lattice crust cooling on a wooden table', slug: 'apple-pie-scratch' },
{ title: 'Beef Stew', creator: 'Jake Torres', time: '2 hrs', image: "https://images.unsplash.com/photo-1517847043-aa5de082df8a", alt: 'Rich beef stew with carrots, potatoes, and herbs in a deep pot', slug: 'beef-stew' },
{ title: 'Roast Chicken', creator: 'Sofia Romano', time: '1.5 hrs', image: "https://images.unsplash.com/photo-1602534923950-d2c7e6be0ca0", alt: 'Golden roast chicken with crispy skin and herbs on a roasting pan', slug: 'roast-chicken' }];


const breakfastRecipes = [
{ title: 'Fluffy Buttermilk Pancakes', creator: 'Emma Walsh', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1966aab-1767129915183.png", alt: 'Stack of fluffy golden buttermilk pancakes with maple syrup and fresh berries', slug: 'fluffy-buttermilk-pancakes' },
{ title: 'Eggs Benedict', creator: 'Marco Rossi', time: '25 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1890ea5f7-1772766498216.png", alt: 'Classic eggs benedict with hollandaise sauce on toasted English muffin', slug: 'eggs-benedict' },
{ title: 'Overnight Oats', creator: 'Priya Nair', time: '5 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13d3c8d39-1772083435970.png", alt: 'Creamy overnight oats in a mason jar topped with fresh fruit and nuts', slug: 'overnight-oats' },
{ title: 'French Toast', creator: 'Sofia Patel', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1623375477518-9d04f307e82b", alt: 'Golden thick-cut French toast dusted with powdered sugar and fresh strawberries', slug: 'french-toast' },
{ title: 'Breakfast Burrito', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_116ccbc83-1772393582608.png", alt: 'Loaded breakfast burrito with scrambled eggs, cheese, salsa, and avocado', slug: 'breakfast-burrito' },
{ title: 'Acai Bowl', creator: 'Aisha Sharma', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1455099797519-a70bccc199c1", alt: 'Vibrant purple acai bowl topped with granola, banana slices, and honey drizzle', slug: 'acai-bowl' }];


const pastaRecipes = [
{ title: 'Cacio e Pepe', creator: 'Sofia Romano', time: '20 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e568055d-1772085885754.png", alt: 'Creamy cacio e pepe pasta with black pepper and pecorino romano cheese', slug: 'cacio-e-pepe' },
{ title: 'Pesto Gnocchi', creator: 'Marco Rossi', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a38c4769-1784801278829.png", alt: 'Pillowy gnocchi tossed in vibrant green basil pesto with pine nuts', slug: 'pesto-gnocchi' },
{ title: 'Pasta Arrabbiata', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_156bff04d-1772207897368.png", alt: 'Spicy arrabbiata pasta with tomato sauce, garlic, and red chili flakes', slug: 'pasta-arrabbiata' },
{ title: 'Mushroom Risotto', creator: 'Maria Chen', time: '40 min', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1680420574628-225def8eea0a", alt: 'Creamy mushroom risotto with parmesan cheese and fresh thyme garnish', slug: 'mushroom-risotto' },
{ title: 'Baked Mac & Cheese', creator: 'Jake Torres', time: '45 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1beb1562f-1772222748789.png", alt: 'Golden baked macaroni and cheese with crispy breadcrumb topping', slug: 'baked-mac-cheese' },
{ title: 'Spaghetti Bolognese', creator: 'Marco Rossi', time: '1 hr', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1634838512151-0773b35c91ee", alt: 'Classic spaghetti bolognese with rich meat sauce and parmesan cheese', slug: 'spaghetti-bolognese' }];


const bbqRecipes = [
{ title: 'BBQ Baby Back Ribs', creator: 'Jake Torres', time: '3 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c57cdb81-1770832572556.png", alt: 'Smoky BBQ baby back ribs with caramelized sauce on a wooden board', slug: 'bbq-baby-back-ribs' },
{ title: 'Grilled Corn on the Cob', creator: 'Carlos Mendez', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1570716774271-ab30ad4924a8", alt: 'Charred grilled corn on the cob with butter, lime, and chili powder', slug: 'grilled-corn' },
{ title: 'Smoked Brisket', creator: 'Jake Torres', time: '8 hrs', difficulty: 'Hard', image: "https://images.unsplash.com/photo-1614231558486-b5bc24dd2d84", alt: 'Thick sliced smoked brisket with dark bark and pink smoke ring', slug: 'smoked-brisket' },
{ title: 'Grilled Veggie Skewers', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1635882686740-edfc701b48ae", alt: 'Colorful grilled vegetable skewers with zucchini, peppers, and mushrooms', slug: 'grilled-veggie-skewers' },
{ title: 'Pulled Pork Sandwiches', creator: 'Carlos Mendez', time: '6 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1557b105b-1773111482327.png", alt: 'Tender pulled pork piled high on a brioche bun with coleslaw', slug: 'pulled-pork-sandwiches' },
{ title: 'Grilled Salmon Fillet', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1693164224779-9a7a8fc7b6d2", alt: 'Perfectly grilled salmon fillet with lemon and herbs on a grill', slug: 'grilled-salmon-fillet' }];


const bakingRecipes = [
{ title: 'Sourdough Bread', creator: 'Emma Walsh', time: '24 hrs', difficulty: 'Hard', image: "https://images.unsplash.com/photo-1658695985093-86cccecf81a5", alt: 'Rustic sourdough loaf with scored crust cooling on a wire rack', slug: 'sourdough-bread' },
{ title: 'Chocolate Lava Cake', creator: 'Sofia Romano', time: '25 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19e43404e-1773176612518.png", alt: 'Warm chocolate lava cake with molten center and powdered sugar dusting', slug: 'chocolate-lava-cake' },
{ title: 'Banana Bread', creator: 'Priya Nair', time: '1 hr', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_12da978a7-1778500554885.png", alt: 'Moist golden banana bread loaf with walnuts on a cutting board', slug: 'banana-bread' },
{ title: 'Cinnamon Rolls', creator: 'Emma Walsh', time: '2 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1aecd958f-1772207180241.png", alt: 'Freshly baked cinnamon rolls with cream cheese frosting in a baking pan', slug: 'cinnamon-rolls' },
{ title: 'Blueberry Muffins', creator: 'Aisha Sharma', time: '35 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1558303420-f814d8a590f5", alt: 'Golden blueberry muffins with sugar crumble topping in a muffin tin', slug: 'blueberry-muffins' },
{ title: 'Cheesecake', creator: 'Sofia Patel', time: '4 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e366641f-1772871592638.png", alt: 'Creamy New York style cheesecake with graham cracker crust and berry topping', slug: 'cheesecake' }];


const airFryerRecipes = [
{ title: 'Air Fryer Chicken Wings', creator: 'Jake Torres', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dc41e977-1772091572034.png", alt: 'Crispy air fryer chicken wings with buffalo sauce and blue cheese dip', slug: 'air-fryer-chicken-wings' },
{ title: 'Air Fryer French Fries', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1601592430325-e0e1551b48ef", alt: 'Golden crispy air fryer french fries with sea salt in a paper cone', slug: 'air-fryer-french-fries' },
{ title: 'Air Fryer Salmon', creator: 'Maria Chen', time: '12 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13cb601db-1782924149319.png", alt: 'Perfectly cooked air fryer salmon with lemon and dill garnish', slug: 'air-fryer-salmon' },
{ title: 'Air Fryer Donuts', creator: 'Emma Walsh', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1606312618872-929717f93c21", alt: 'Fluffy air fryer donuts with glaze and colorful sprinkles', slug: 'air-fryer-donuts' },
{ title: 'Air Fryer Vegetables', creator: 'Priya Nair', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b3a1542b-1772084616223.png", alt: 'Crispy roasted air fryer vegetables with olive oil and herbs', slug: 'air-fryer-vegetables' },
{ title: 'Air Fryer Steak', creator: 'Jake Torres', time: '15 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1db10218f-1772446279214.png", alt: 'Perfectly seared air fryer steak with herb butter on a cast iron plate', slug: 'air-fryer-steak' }];


const vegetarianRecipes = [
{ title: 'Stuffed Bell Peppers', creator: 'Leila Hassan', time: '45 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1706222173694-5264de2d23d9", alt: 'Colorful stuffed bell peppers filled with rice, vegetables, and melted cheese', slug: 'stuffed-bell-peppers' },
{ title: 'Vegetable Curry', creator: 'Aisha Sharma', time: '35 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1585034888529-0898b2145847", alt: 'Fragrant vegetable curry with chickpeas, spinach, and coconut milk', slug: 'vegetable-curry' },
{ title: 'Caprese Pasta', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1610817153377-e54299ffdb1e", alt: 'Fresh caprese pasta with cherry tomatoes, mozzarella, and basil', slug: 'caprese-pasta' },
{ title: 'Falafel Wrap', creator: 'Leila Hassan', time: '30 min', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1636168655089-5e625a233354", alt: 'Crispy falafel wrap with hummus, vegetables, and tahini sauce', slug: 'falafel-wrap' },
{ title: 'Margherita Pizza', creator: 'Marco Rossi', time: '30 min', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1703784022146-b72677752ce5", alt: 'Classic margherita pizza with fresh mozzarella, tomato sauce, and basil leaves', slug: 'margherita-pizza' },
{ title: 'Mushroom Tacos', creator: 'Rosa Gutierrez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1721001309902-939443092f13", alt: 'Savory mushroom tacos with chipotle sauce, avocado, and pickled onions', slug: 'mushroom-tacos' }];


const soupRecipes = [
{ title: 'Tomato Bisque', creator: 'Emma Walsh', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1616537380218-372f4d2830ee", alt: 'Creamy roasted tomato bisque with fresh basil and a swirl of cream', slug: 'tomato-bisque' },
{ title: 'French Onion Soup', creator: 'Sofia Romano', time: '1 hr', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13b832fd6-1772088178489.png", alt: 'Classic French onion soup with caramelized onions and melted gruyere crouton', slug: 'french-onion-soup' },
{ title: 'Ramen from Scratch', creator: 'Yuna Kim', time: '3 hrs', difficulty: 'Hard', image: "https://img.rocket.new/generatedImages/rocket_gen_img_16fa22663-1772767892756.png", alt: 'Rich tonkotsu ramen with chashu pork, soft-boiled egg, and nori', slug: 'ramen-from-scratch' },
{ title: 'Minestrone', creator: 'Marco Rossi', time: '45 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e2f801ab-1773084071073.png", alt: 'Hearty Italian minestrone soup with vegetables, beans, and pasta', slug: 'minestrone' },
{ title: 'Clam Chowder', creator: 'Maria Chen', time: '40 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_166dafed2-1773214700374.png", alt: 'Creamy New England clam chowder with potatoes and crispy bacon bits', slug: 'clam-chowder' },
{ title: 'Miso Soup', creator: 'Yuki Tanaka', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19eb07291-1773191218850.png", alt: 'Traditional Japanese miso soup with tofu, wakame seaweed, and green onions', slug: 'miso-soup' }];


const spotlightCreators = [
{ name: 'Maria Chen', handle: '@mariachencooks', specialty: 'Asian Fusion', followers: '124K', recipes: 89, image: "https://img.rocket.new/generatedImages/rocket_gen_img_102df199c-1772058867782.png", alt: 'Portrait of food creator Maria Chen smiling in her kitchen' },
{ name: 'Jake Torres', handle: '@jaketorrescooks', specialty: 'Street Food', followers: '98K', recipes: 67, image: "https://img.rocket.new/generatedImages/rocket_gen_img_112cb3572-1763301680407.png", alt: 'Portrait of food creator Jake Torres holding a taco' },
{ name: 'Sofia Patel', handle: '@sofiapatelkitchen', specialty: 'Mediterranean', followers: '76K', recipes: 112, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1802b76bb-1775545865831.png", alt: 'Portrait of food creator Sofia Patel in her bright kitchen' }];


interface Recipe {
  title: string;
  creator: string;
  time?: string;
  difficulty?: string;
  image: string;
  alt: string;
  slug: string;
}

function RecipeCard({ recipe, size = 'md' }: {recipe: Recipe;size?: 'sm' | 'md';}) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="card-recipe group block">
      <div className={`relative overflow-hidden ${size === 'sm' ? 'h-40' : 'h-52'}`}>
        <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-gray-800 hover:bg-white transition-colors"
          aria-label="Save recipe"
          onClick={(e) => e.preventDefault()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors">{recipe.title}</h3>
        <p className="text-muted-foreground text-xs">{recipe.creator}</p>
        {(recipe.time || recipe.difficulty) &&
        <div className="flex items-center gap-3 mt-2">
            {recipe.time &&
          <span className="text-xs text-muted-foreground flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
                {recipe.time}
              </span>
          }
            {recipe.difficulty &&
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${recipe.difficulty === 'Easy' ? 'bg-muted text-primary' : recipe.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-secondary text-accent'}`}>
                {recipe.difficulty}
              </span>
          }
          </div>
        }
      </div>
    </Link>);

}

interface FilterState {
  cuisine: string;
  mealType: string;
  time: string;
  difficulty: string;
  dietary: string[];
}

function FilterPanel({ filters, setFilters, onClose



}: {filters: FilterState;setFilters: (f: FilterState) => void;onClose: () => void;}) {
  const [local, setLocal] = useState<FilterState>(filters);

  const toggleDietary = (tag: string) => {
    setLocal((prev) => ({
      ...prev,
      dietary: prev.dietary.includes(tag) ? prev.dietary.filter((d) => d !== tag) : [...prev.dietary, tag]
    }));
  };

  const apply = () => {setFilters(local);onClose();};
  const reset = () => setLocal({ cuisine: 'Any', mealType: 'Any', time: 'Any', difficulty: 'Any', dietary: [] });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Filter recipes">
      <div className="bg-card border border-border rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-3xl sm:rounded-t-3xl">
          <h2 className="font-extrabold text-foreground text-lg">Filter Recipes</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors" aria-label="Close filters">✕</button>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Cuisine</p>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map((c) =>
              <button key={c} onClick={() => setLocal({ ...local, cuisine: c })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.cuisine === c ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {c}
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Meal Type</p>
            <div className="flex flex-wrap gap-2">
              {mealTypeOptions.map((m) =>
              <button key={m} onClick={() => setLocal({ ...local, mealType: m })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.mealType === m ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {m}
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Cooking Time</p>
            <div className="flex flex-wrap gap-2">
              {timeOptions.map((t) =>
              <button key={t} onClick={() => setLocal({ ...local, time: t })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.time === t ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {t}
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.map((d) =>
              <button key={d} onClick={() => setLocal({ ...local, difficulty: d })}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.difficulty === d ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`}>
                  {d}
                </button>
              )}
            </div>
          </div>
          <div>
            <p className="font-bold text-foreground text-sm mb-3">Dietary Tags</p>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((d) =>
              <button key={d} onClick={() => toggleDietary(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${local.dietary.includes(d) ? 'bg-accent text-white' : 'bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent'}`}>
                  {d}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex gap-3">
          <button onClick={reset} className="flex-1 btn-secondary text-sm">Reset</button>
          <button onClick={apply} className="flex-1 btn-primary text-sm">Apply Filters</button>
        </div>
      </div>
    </div>);

}

function SectionHeader({ id, label, title, subtitle, filterLink }: {id: string;label?: string;title: string;subtitle?: string;filterLink: string;}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {label && <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">{label}</p>}
        <h2 id={id} className="text-2xl font-extrabold text-foreground">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
      </div>
      <Link href={filterLink} className="text-primary text-sm font-semibold hover:underline shrink-0 mt-1">See all</Link>
    </div>);

}

export default function RecipesPageClient() {
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ cuisine: 'Any', mealType: 'Any', time: 'Any', difficulty: 'Any', dietary: [] });

  const activeFilterCount = [
  filters.cuisine !== 'Any' ? 1 : 0,
  filters.mealType !== 'Any' ? 1 : 0,
  filters.time !== 'Any' ? 1 : 0,
  filters.difficulty !== 'Any' ? 1 : 0,
  filters.dietary.length].
  reduce((a, b) => a + b, 0);

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Hero Search */}
      <section className="pt-28 pb-16 px-4 bg-gradient-to-b from-muted to-background">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-hero-lg font-extrabold text-foreground mb-4 tracking-tight">
            Find something worth cooking.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Search by dish, ingredient, cuisine, cooking time, skill level, dietary preference, or the mood you are in.
          </p>
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Try "30-minute chicken," "vegan pasta," or "what can I make with eggs?"'
              className="w-full pl-5 pr-14 py-4 rounded-2xl border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-sm shadow-sm"
              aria-label="Search recipes" />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-xs"
              aria-label="Search">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category Chips + Filter Button */}
      <section className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
              {categories.map((cat) =>
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'}`
                }>
                  {cat}
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all ${
              activeFilterCount > 0 ? 'border-primary text-primary bg-primary/5' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`
              }
              aria-label="Open filters">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </button>
          </div>
        </div>
      </section>

      {showFilters &&
      <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
      }

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* Featured Recipe of the Day */}
        <section aria-labelledby="featured-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Recipe of the Day</p>
              <h2 id="featured-heading" className="text-2xl font-extrabold text-foreground">Today&apos;s pick</h2>
            </div>
          </div>
          <Link href="/recipes/crispy-honey-garlic-salmon" className="group block">
            <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 lg:h-[480px]">
              <img src={featuredRecipe.image} alt={featuredRecipe.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-3">
                  {featuredRecipe.tags.map((tag) =>
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">{tag}</span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">{featuredRecipe.title}</h3>
                <p className="text-white/80 text-sm mb-4 max-w-lg hidden sm:block">{featuredRecipe.description}</p>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-white/80 text-sm">by {featuredRecipe.creator}</span>
                  <span className="text-white/60 text-sm">⏱ {featuredRecipe.time}</span>
                  <span className="text-white/60 text-sm">⭐ {featuredRecipe.rating}</span>
                  <span className="text-white/60 text-sm">🍳 {featuredRecipe.cooks.toLocaleString()} made this</span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* Trending on Chew */}
        <section aria-labelledby="trending-heading">
          <SectionHeader id="trending-heading" label="Hot right now" title="Trending on Chew" filterLink="/recipes/section/trending" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingRecipes.map((recipe) =>
            <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="card-recipe group block">
                <div className="relative h-48 overflow-hidden">
                  <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">🔥 {recipe.cooks.toLocaleString()} made this</span>
                  </div>
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors" aria-label="Save recipe" onClick={(e) => e.preventDefault()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors">{recipe.title}</h3>
                  <p className="text-muted-foreground text-xs mb-2">{recipe.creator}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">⏱ {recipe.time}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${recipe.difficulty === 'Easy' ? 'bg-muted text-primary' : 'bg-secondary text-accent'}`}>{recipe.difficulty}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Breakfast */}
        <section aria-labelledby="breakfast-heading">
          <SectionHeader id="breakfast-heading" label="Morning meals" title="Breakfast & Brunch" subtitle="Start your day the delicious way" filterLink="/recipes/section/breakfast" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {breakfastRecipes.map((recipe) =>
            <RecipeCard key={recipe.slug} recipe={recipe} size="sm" />
            )}
          </div>
        </section>

        {/* Ready in 30 minutes */}
        <section aria-labelledby="quick-heading">
          <SectionHeader id="quick-heading" title="Ready in 30 minutes or less" filterLink="/recipes/section/quick" />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6">
            {quickRecipes.map((recipe) =>
            <div key={recipe.slug} className="shrink-0 w-48 lg:w-auto">
                <RecipeCard recipe={recipe} size="sm" />
              </div>
            )}
          </div>
        </section>

        {/* Cook around the world */}
        <section aria-labelledby="global-heading" className="section-cream rounded-3xl p-8">
          <SectionHeader id="global-heading" title="Cook around the world" subtitle="Explore cuisines from every corner of the globe" filterLink="/recipes/section/global" />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {globalRecipes.map((recipe) =>
            <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="card-recipe group block">
                <div className="relative h-44 overflow-hidden">
                  <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-bold bg-accent/80 px-2 py-1 rounded-full">{(recipe as typeof globalRecipes[0]).cuisine}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{recipe.title}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">{recipe.creator}</p>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Pasta & Noodles */}
        <section aria-labelledby="pasta-heading">
          <SectionHeader id="pasta-heading" label="Comfort food" title="Pasta & Noodles" subtitle="From classic Italian to Asian noodle bowls" filterLink="/recipes/section/pasta" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {pastaRecipes.map((recipe) =>
            <RecipeCard key={recipe.slug} recipe={recipe} size="sm" />
            )}
          </div>
        </section>

        {/* Healthy choices */}
        <section aria-labelledby="healthy-heading">
          <SectionHeader id="healthy-heading" title="Healthy choices" subtitle="Fresh, balanced, and full of flavor" filterLink="/recipes/section/healthy" />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6">
            {healthyRecipes.map((recipe) =>
            <div key={recipe.slug} className="shrink-0 w-48 lg:w-auto">
                <RecipeCard recipe={recipe} size="sm" />
              </div>
            )}
          </div>
        </section>

        {/* Vegetarian */}
        <section aria-labelledby="vegetarian-heading" className="section-cream rounded-3xl p-8">
          <SectionHeader id="vegetarian-heading" label="Plant-based" title="Vegetarian Favorites" subtitle="Satisfying meals without the meat" filterLink="/recipes/section/vegetarian" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {vegetarianRecipes.map((recipe) =>
            <RecipeCard key={recipe.slug} recipe={recipe} size="sm" />
            )}
          </div>
        </section>

        {/* BBQ & Grilling */}
        <section aria-labelledby="bbq-heading">
          <SectionHeader id="bbq-heading" label="Fire it up" title="BBQ & Grilling" subtitle="Low and slow, or hot and fast" filterLink="/recipes/section/bbq" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {bbqRecipes.map((recipe) =>
            <RecipeCard key={recipe.slug} recipe={recipe} size="sm" />
            )}
          </div>
        </section>

        {/* Soups & Stews */}
        <section aria-labelledby="soups-heading">
          <SectionHeader id="soups-heading" label="Warm up" title="Soups & Stews" subtitle="Bowl food for every season" filterLink="/recipes/section/soups" />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-6">
            {soupRecipes.map((recipe) =>
            <div key={recipe.slug} className="shrink-0 w-48 lg:w-auto">
                <RecipeCard recipe={recipe} size="sm" />
              </div>
            )}
          </div>
        </section>

        {/* Air Fryer */}
        <section aria-labelledby="airfryer-heading" className="section-cream rounded-3xl p-8">
          <SectionHeader id="airfryer-heading" label="Crispy & quick" title="Air Fryer Recipes" subtitle="Crispy results with less oil" filterLink="/recipes/section/air-fryer" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {airFryerRecipes.map((recipe) =>
            <RecipeCard key={recipe.slug} recipe={recipe} size="sm" />
            )}
          </div>
        </section>

        {/* Baking & Desserts */}
        <section aria-labelledby="baking-heading">
          <SectionHeader id="baking-heading" label="Sweet treats" title="Baking & Desserts" subtitle="From everyday bakes to showstoppers" filterLink="/recipes/section/baking" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {bakingRecipes.map((recipe) =>
            <RecipeCard key={recipe.slug} recipe={recipe} size="sm" />
            )}
          </div>
        </section>

        {/* Family recipes */}
        <section aria-labelledby="family-heading">
          <SectionHeader id="family-heading" title="Family recipes" subtitle="Recipes worth passing down" filterLink="/recipes/section/family" />
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {familyRecipes.map((recipe) =>
            <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className="card-recipe group block">
                <div className="relative h-44 overflow-hidden">
                  <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{recipe.title}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">{recipe.creator}{(recipe as typeof familyRecipes[0]).time ? ` · ${(recipe as typeof familyRecipes[0]).time}` : ''}</p>
                </div>
              </Link>
            )}
          </div>
        </section>

        {/* Creator Spotlight */}
        <section aria-labelledby="creators-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="creators-heading" className="text-2xl font-extrabold text-foreground">Creators to watch</h2>
            <Link href="/creators" className="text-primary text-sm font-semibold hover:underline">All creators</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {spotlightCreators.map((creator) =>
            <div key={creator.handle} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 hover:shadow-card-hover transition-all duration-300">
                <img src={creator.image} alt={creator.alt} className="w-14 h-14 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-sm">{creator.name}</p>
                  <p className="text-muted-foreground text-xs">{creator.handle}</p>
                  <p className="text-xs text-accent font-medium mt-0.5">{creator.specialty}</p>
                  <div className="flex gap-3 mt-1">
                    <span className="text-xs text-muted-foreground">{creator.followers} followers</span>
                    <span className="text-xs text-muted-foreground">{creator.recipes} recipes</span>
                  </div>
                </div>
                <button className="btn-secondary py-1.5 px-3 text-xs shrink-0">Follow</button>
              </div>
            )}
          </div>
        </section>

        {/* Join CTA */}
        <section className="bg-foreground rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Save recipes. Build collections. Cook with Chef Pepe.
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Create your free account to save favourites, build meal plans, and get step-by-step help from Chef Pepe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/join" className="btn-primary">Join Chew — it&apos;s free</Link>
            <Link href="/chef-pepe" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-foreground">Ask Chef Pepe</Link>
          </div>
        </section>

      </div>

      <Footer />
    </main>);

}