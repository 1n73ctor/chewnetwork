'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Recipe {
  title: string;
  creator: string;
  time?: string;
  difficulty?: string;
  cuisine?: string;
  image: string;
  alt: string;
  slug: string;
}

function RecipeCard({ recipe }: {recipe: Recipe;}) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="card-recipe group block">
      <div className="relative overflow-hidden h-52">
        <img src={recipe.image} alt={recipe.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {recipe.cuisine && <div className="absolute bottom-3 left-3"><span className="text-white text-xs font-bold bg-accent/80 px-2 py-1 rounded-full">{recipe.cuisine}</span></div>}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-foreground hover:bg-white transition-colors" aria-label="Save recipe" onClick={(e) => e.preventDefault()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-sm leading-snug mb-1 group-hover:text-primary transition-colors">{recipe.title}</h3>
        <p className="text-muted-foreground text-xs">{recipe.creator}</p>
        {(recipe.time || recipe.difficulty) && <div className="flex items-center gap-3 mt-2">
          {recipe.time && <span className="text-xs text-muted-foreground flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>{recipe.time}</span>}
          {recipe.difficulty && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${recipe.difficulty === 'Easy' ? 'bg-muted text-primary' : recipe.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-secondary text-accent'}`}>{recipe.difficulty}</span>}
        </div>}
      </div>
    </Link>);

}

const allSectionData: Record<string, {title: string;subtitle: string;label?: string;recipes: Recipe[];}> = {
  trending: {
    title: 'Trending on Chew',
    label: 'Hot right now',
    subtitle: 'The most-cooked recipes on the platform right now',
    recipes: [
    { title: 'Smash Burger Tacos', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1acf3cb0a-1772799442431.png', alt: 'Smash burger patty folded in a crispy taco shell with cheese and toppings', slug: 'smash-burger-tacos' },
    { title: 'One-Pan Lemon Orzo', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1643013913601-5d006291d577", alt: 'Creamy lemon orzo pasta with spinach and parmesan in a cast iron pan', slug: 'one-pan-lemon-orzo' },
    { title: 'Korean Corn Dogs', creator: 'Yuna Kim', time: '35 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1eead6026-1771887177210.png', alt: 'Korean-style corn dogs coated in crispy batter with sugar and ketchup drizzle', slug: 'korean-corn-dogs' },
    { title: 'Mango Coconut Chia Pudding', creator: 'Priya Nair', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1561997315-6d0610a96b9c", alt: 'Layered mango coconut chia pudding in a glass jar topped with fresh mango slices', slug: 'mango-coconut-chia-pudding' },
    { title: 'Birria Tacos', creator: 'Rosa Gutierrez', time: '3 hrs', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1611250188496-e966043a0629", alt: 'Crispy birria tacos dipped in rich consommé with melted cheese and cilantro', slug: 'birria-tacos' },
    { title: 'Viral Feta Pasta', creator: 'Emma Walsh', time: '40 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1493151333614-26ed2c07f9c6', alt: 'Baked feta pasta with cherry tomatoes and fresh basil in a baking dish', slug: 'viral-feta-pasta' },
    { title: 'Butter Board', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1589310209417-a496eea2eac0', alt: 'Whipped butter spread on a wooden board with honey, herbs, and edible flowers', slug: 'butter-board' },
    { title: 'Crispy Rice Salad', creator: 'Maria Chen', time: '25 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1719910327777-a2489921021a', alt: 'Crispy fried rice topped with fresh vegetables and sesame dressing in a bowl', slug: 'crispy-rice-salad' },
    { title: 'Marry Me Chicken', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f79e6ddb-1772630172931.png', alt: 'Creamy sun-dried tomato chicken in a cast iron skillet with fresh basil', slug: 'marry-me-chicken' },
    { title: 'Cottage Cheese Flatbread', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1696189052117-e40ac954a754", alt: 'Golden cottage cheese flatbread with herbs and toppings on a baking sheet', slug: 'cottage-cheese-flatbread' },
    { title: 'Cucumber Salad', creator: 'Yuna Kim', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18fa09647-1765898626493.png", alt: 'Refreshing cucumber salad with rice vinegar, sesame oil, and chili flakes', slug: 'cucumber-salad' },
    { title: 'Whipped Feta Dip', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1646587433838-0159a05ba4d7', alt: 'Creamy whipped feta dip with olive oil, honey, and fresh herbs on a plate', slug: 'whipped-feta-dip' },
    { title: 'Baked Oats', creator: 'Emma Walsh', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1582215580615-063d79c2cc34", alt: 'Baked oats with banana, chocolate chips, and peanut butter in a ramekin', slug: 'baked-oats' },
    { title: 'Pasta Chips', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927', alt: 'Crispy air-fried pasta chips with parmesan and marinara dipping sauce', slug: 'pasta-chips' },
    { title: 'Cloud Bread', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19a6c3662-1785351135381.png", alt: 'Fluffy cloud bread rounds made with eggs and cream cheese on a baking sheet', slug: 'cloud-bread' },
    { title: 'Salmon Rice Bowl', creator: 'Yuna Kim', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1900c313c-1772799440716.png", alt: 'Spicy salmon rice bowl with cucumber, avocado, and sriracha mayo', slug: 'salmon-rice-bowl' },
    { title: 'Tortilla Quiche', creator: 'Emma Walsh', time: '35 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1667499707432-0524fcfb63ba", alt: 'Easy tortilla quiche with spinach, cheese, and eggs in a crispy shell', slug: 'tortilla-quiche' },
    { title: 'Chili Oil Eggs', creator: 'Lin Wei', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13bbb7ba5-1772058485902.png", alt: 'Fried eggs drizzled with homemade chili oil and scallions over rice', slug: 'chili-oil-eggs' },
    { title: 'Stuffed Dates', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1619046212867-9b0cfaa37186", alt: 'Medjool dates stuffed with almond butter and topped with sea salt flakes', slug: 'stuffed-dates' },
    { title: 'Dalgona Coffee', creator: 'Yuna Kim', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1590092783139-5db57ff2cd83", alt: 'Whipped dalgona coffee foam over iced milk in a tall glass', slug: 'dalgona-coffee' },
    { title: 'Smoked Salmon Toast', creator: 'Maria Chen', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1601261117161-9374344c2210", alt: 'Sourdough toast with cream cheese, smoked salmon, and everything bagel seasoning', slug: 'smoked-salmon-toast' },
    { title: 'Birria Ramen', creator: 'Rosa Gutierrez', time: '3.5 hrs', difficulty: 'Hard', image: "https://images.unsplash.com/photo-1641642398311-45e905de2082", alt: 'Fusion birria ramen with rich consommé broth, ramen noodles, and cheese', slug: 'birria-ramen' },
    { title: 'Loaded Nachos', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1601831132992-548e9366e073", alt: 'Loaded nachos with melted cheese, jalapeños, sour cream, and guacamole', slug: 'loaded-nachos' },
    { title: 'Honey Garlic Salmon', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13581a46c-1772646980537.png", alt: 'Glazed honey garlic salmon fillets with sesame seeds and green onions', slug: 'honey-garlic-salmon' },
    { title: 'Shakshuka', creator: 'Leila Hassan', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1585975754487-25489eabf36a", alt: 'Eggs poached in spiced tomato and pepper sauce in a cast iron skillet', slug: 'shakshuka' },
    { title: 'Teriyaki Chicken Bowl', creator: 'Yuki Tanaka', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1634640848446-6d4d670b5142", alt: 'Teriyaki glazed chicken over steamed rice with broccoli and sesame seeds', slug: 'teriyaki-chicken-bowl' },
    { title: 'Pesto Pasta', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1689793601570-7980ac301eca', alt: 'Fresh basil pesto pasta with cherry tomatoes and parmesan cheese', slug: 'pesto-pasta' },
    { title: 'Chocolate Mug Cake', creator: 'Emma Walsh', time: '5 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_11171b300-1772799441963.png", alt: 'Warm chocolate mug cake with gooey center topped with ice cream', slug: 'chocolate-mug-cake' },
    { title: 'Garlic Naan Pizza', creator: 'Aisha Sharma', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_163f55b55-1769407178742.png", alt: 'Quick naan pizza with garlic butter, mozzarella, and fresh toppings', slug: 'garlic-naan-pizza' },
    { title: 'Tuna Poke Bowl', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1597958792579-bd3517df6399', alt: 'Fresh tuna poke bowl with sushi rice, edamame, avocado, and sesame dressing', slug: 'tuna-poke-bowl' },
    { title: 'Egg Fried Rice', creator: 'Lin Wei', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_102679685-1772733854247.png", alt: 'Wok-tossed egg fried rice with vegetables and soy sauce in a bowl', slug: 'egg-fried-rice' },
    { title: 'Caprese Salad', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_14fe786d4-1772650699880.png", alt: 'Classic caprese salad with fresh mozzarella, tomatoes, basil and balsamic glaze', slug: 'caprese-salad' },
    { title: 'Spicy Ramen', creator: 'Yuna Kim', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1710573558322-a8d98ecd5053", alt: 'Spicy instant ramen upgraded with soft-boiled egg, nori, and chili oil', slug: 'spicy-ramen' },
    { title: 'Chicken Quesadilla', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1630914441316-6d95bbd00caf", alt: 'Crispy chicken quesadilla with melted cheese, peppers, and sour cream', slug: 'chicken-quesadilla' },
    { title: 'Avocado Egg Salad', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1659474687639-9572736365e4", alt: 'Creamy avocado egg salad on toasted bread with microgreens', slug: 'avocado-egg-salad' },
    { title: 'Lemon Butter Pasta', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_17e05496a-1771904964499.png", alt: 'Simple lemon butter pasta with parmesan and fresh herbs', slug: 'lemon-butter-pasta' },
    { title: 'Miso Glazed Eggplant', creator: 'Yuki Tanaka', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1635683f8-1772057315477.png", alt: 'Roasted eggplant with sweet miso glaze and sesame seeds', slug: 'miso-glazed-eggplant' },
    { title: 'Crispy Tofu Bowl', creator: 'Lin Wei', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1546069901-55d1670321aa", alt: 'Crispy baked tofu over rice with peanut sauce and fresh vegetables', slug: 'crispy-tofu-bowl' },
    { title: 'Beef Bulgogi', creator: 'Min-Jun Oh', time: '30 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f028ab6b-1779993139967.png', alt: 'Marinated Korean beef bulgogi with sesame seeds and green onions over rice', slug: 'beef-bulgogi' },
    { title: 'Shrimp Tacos', creator: 'Rosa Gutierrez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1611250188496-e966043a0629", alt: 'Crispy shrimp tacos with cabbage slaw, avocado, and chipotle crema', slug: 'shrimp-tacos' },
    { title: 'Stuffed Mushrooms', creator: 'Sofia Romano', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1578413092649-e4c1c42022de", alt: 'Baked stuffed mushrooms with cream cheese, garlic, and herbs', slug: 'stuffed-mushrooms' },
    { title: 'Banana Nice Cream', creator: 'Priya Nair', time: '5 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1671527281209-7b3a8dff51ce", alt: 'Creamy one-ingredient banana nice cream in a bowl with toppings', slug: 'banana-nice-cream' },
    { title: 'Garlic Butter Steak Bites', creator: 'Jake Torres', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e6d3a8b3-1778761464840.png", alt: 'Sizzling garlic butter steak bites with herbs in a cast iron pan', slug: 'garlic-butter-steak-bites' },
    { title: 'Watermelon Feta Salad', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1727618534372-ddc94e872d04", alt: 'Refreshing watermelon and feta salad with mint and balsamic glaze', slug: 'watermelon-feta-salad' },
    { title: 'Chicken Shawarma', creator: 'Leila Hassan', time: '30 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1444be92e-1767548001932.png", alt: 'Spiced chicken shawarma wrap with garlic sauce and pickled vegetables', slug: 'chicken-shawarma' },
    { title: 'Mushroom Risotto', creator: 'Maria Chen', time: '40 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1680420574628-225def8eea0a', alt: 'Creamy mushroom risotto with parmesan cheese and fresh thyme garnish', slug: 'mushroom-risotto' },
    { title: 'Lobster Roll', creator: 'Maria Chen', time: '20 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dce2cdca-1779265932053.png", alt: 'Classic New England lobster roll with mayo and celery on a toasted bun', slug: 'lobster-roll' },
    { title: 'Cacio e Pepe', creator: 'Sofia Romano', time: '20 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e568055d-1772085885754.png', alt: 'Creamy cacio e pepe pasta with black pepper and pecorino romano cheese', slug: 'cacio-e-pepe' },
    { title: 'Pad Thai', creator: 'Somchai Wongsa', time: '30 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1663905494561-f70d406eff0d', alt: 'Classic pad thai noodles with shrimp, bean sprouts, peanuts, and lime wedge', slug: 'pad-thai' },
    { title: 'Butter Chicken', creator: 'Aisha Sharma', time: '50 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18c6478cb-1772187609323.png', alt: 'Creamy butter chicken curry with tender chicken pieces and aromatic spices', slug: 'butter-chicken' }]

  },
  breakfast: {
    title: 'Breakfast & Brunch',
    label: 'Morning meals',
    subtitle: 'Start your day the delicious way',
    recipes: [
    { title: 'Fluffy Buttermilk Pancakes', creator: 'Emma Walsh', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1791e4fa0-1772289647107.png", alt: 'Stack of fluffy golden buttermilk pancakes with maple syrup and fresh berries', slug: 'fluffy-buttermilk-pancakes' },
    { title: 'Eggs Benedict', creator: 'Marco Rossi', time: '25 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1890ea5f7-1772766498216.png', alt: 'Classic eggs benedict with hollandaise sauce on toasted English muffin', slug: 'eggs-benedict' },
    { title: 'Overnight Oats', creator: 'Priya Nair', time: '5 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d3c8d39-1772083435970.png', alt: 'Creamy overnight oats in a mason jar topped with fresh fruit and nuts', slug: 'overnight-oats' },
    { title: 'French Toast', creator: 'Sofia Patel', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1586195833982-47e978de8f40", alt: 'Golden thick-cut French toast dusted with powdered sugar and fresh strawberries', slug: 'french-toast' },
    { title: 'Breakfast Burrito', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1662478839528-a9c2db7e97b6", alt: 'Loaded breakfast burrito with scrambled eggs, cheese, salsa, and avocado', slug: 'breakfast-burrito' },
    { title: 'Acai Bowl', creator: 'Aisha Sharma', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1561997315-6d0610a96b9c", alt: 'Vibrant purple acai bowl topped with granola, banana slices, and honey drizzle', slug: 'acai-bowl' },
    { title: 'Shakshuka', creator: 'Leila Hassan', time: '25 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e54a3842-1783627091192.png', alt: 'Eggs poached in spiced tomato and pepper sauce in a cast iron skillet', slug: 'shakshuka' },
    { title: 'Avocado Toast with Poached Egg', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1586999690173-ea7eaaca9ae4", alt: 'Thick sourdough toast topped with smashed avocado and a perfectly poached egg', slug: 'avocado-toast-poached-egg' },
    { title: 'Banana Pancakes', creator: 'Priya Nair', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1785648c2-1770310514851.png", alt: 'Golden banana pancakes stacked with maple syrup and sliced bananas', slug: 'banana-pancakes' },
    { title: 'Smoked Salmon Bagel', creator: 'Maria Chen', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1680602573288-5a8fa0ed397d', alt: 'Everything bagel with cream cheese, smoked salmon, capers, and red onion', slug: 'smoked-salmon-bagel' },
    { title: 'Greek Yogurt Parfait', creator: 'Sofia Patel', time: '5 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1691455653742-ea1aded33376', alt: 'Layered Greek yogurt parfait with granola, fresh berries, and honey in a glass', slug: 'greek-yogurt-parfait' },
    { title: 'Breakfast Hash', creator: 'Jake Torres', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1575732957508-da0f9f379b5e", alt: 'Crispy potato breakfast hash with peppers, onions, and fried eggs on top', slug: 'breakfast-hash' },
    { title: 'Crepes', creator: 'Sofia Romano', time: '30 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1731185168371-d7da504f3df2', alt: 'Thin golden crepes folded with strawberries and whipped cream on a white plate', slug: 'crepes' },
    { title: 'Granola from Scratch', creator: 'Emma Walsh', time: '35 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1498560966227-924b32ce2feb', alt: 'Crunchy homemade granola with oats, nuts, seeds, and dried fruit on a baking sheet', slug: 'granola-from-scratch' },
    { title: 'Breakfast Quesadilla', creator: 'Carlos Mendez', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_10b8ab986-1777253207789.png', alt: 'Crispy breakfast quesadilla filled with scrambled eggs, cheese, and salsa', slug: 'breakfast-quesadilla' },
    { title: 'Waffles', creator: 'Emma Walsh', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1504511483610-0de49de55733", alt: 'Crispy golden waffles with fresh berries, whipped cream, and maple syrup', slug: 'waffles' },
    { title: 'Baked Oats', creator: 'Priya Nair', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1582215580615-063d79c2cc34", alt: 'Baked oats with banana, chocolate chips, and peanut butter in a ramekin', slug: 'baked-oats' },
    { title: 'Egg White Omelette', creator: 'Sofia Patel', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c0d2fe9b-1772308581512.png", alt: 'Fluffy egg white omelette with spinach, mushrooms, and feta cheese', slug: 'egg-white-omelette' },
    { title: 'Chia Seed Pudding', creator: 'Aisha Sharma', time: '5 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1629180050285-7c56c6671f19', alt: 'Thick chia seed pudding with coconut milk and fresh mango topping', slug: 'chia-seed-pudding' },
    { title: 'Breakfast Sandwich', creator: 'Jake Torres', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1715571105432-83466f853994", alt: 'Toasted English muffin breakfast sandwich with egg, cheese, and bacon', slug: 'breakfast-sandwich' },
    { title: 'Smoothie Bowl', creator: 'Aisha Sharma', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1635341083002-67e6fa3c5f4b", alt: 'Thick smoothie bowl with mixed berries, granola, and coconut flakes', slug: 'smoothie-bowl' },
    { title: 'Lemon Ricotta Pancakes', creator: 'Sofia Romano', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1791e4fa0-1772289647107.png", alt: 'Fluffy lemon ricotta pancakes with powdered sugar and fresh lemon zest', slug: 'lemon-ricotta-pancakes' },
    { title: 'Huevos Rancheros', creator: 'Rosa Gutierrez', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e54a3842-1783627091192.png', alt: 'Huevos rancheros with fried eggs, salsa roja, and crispy tortillas', slug: 'huevos-rancheros' },
    { title: 'Bircher Muesli', creator: 'Emma Walsh', time: '5 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_108d043bd-1773910722617.png", alt: 'Swiss bircher muesli with soaked oats, apple, and yogurt', slug: 'bircher-muesli' },
    { title: 'Breakfast Tacos', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_116ccbc83-1772393582608.png', alt: 'Soft breakfast tacos with scrambled eggs, chorizo, and pico de gallo', slug: 'breakfast-tacos' },
    { title: 'Dutch Baby Pancake', creator: 'Sofia Romano', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9fe8d06-1785351134851.png", alt: 'Puffed Dutch baby pancake with lemon juice, powdered sugar, and berries', slug: 'dutch-baby-pancake' },
    { title: 'Protein Smoothie', creator: 'Priya Nair', time: '5 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1584587715439-8ae6d53228a2", alt: 'Thick protein smoothie with banana, peanut butter, and chocolate protein powder', slug: 'protein-smoothie' },
    { title: 'Veggie Frittata', creator: 'Marco Rossi', time: '30 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_15021d1d2-1782939122129.png", alt: 'Baked veggie frittata with zucchini, bell peppers, and goat cheese', slug: 'veggie-frittata' },
    { title: 'Cinnamon French Toast Sticks', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_199e41197-1782117159194.png", alt: 'Cinnamon sugar French toast sticks with maple syrup for dipping', slug: 'cinnamon-french-toast-sticks' },
    { title: 'Breakfast Pizza', creator: 'Jake Torres', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_174aff7da-1772174615900.png", alt: 'Breakfast pizza with scrambled eggs, bacon, cheese, and hash brown crust', slug: 'breakfast-pizza' },
    { title: 'Matcha Latte', creator: 'Yuna Kim', time: '5 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1110273b2-1772210749281.png", alt: 'Creamy matcha latte with oat milk and a dusting of matcha powder', slug: 'matcha-latte' },
    { title: 'Egg Muffins', creator: 'Sofia Patel', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1718307495601-5231e6290d8a", alt: 'Mini egg muffins with vegetables and cheese baked in a muffin tin', slug: 'egg-muffins' },
    { title: 'Peanut Butter Banana Toast', creator: 'Priya Nair', time: '5 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1706277909579-d0e489b41808", alt: 'Thick toast with peanut butter, banana slices, honey, and chia seeds', slug: 'peanut-butter-banana-toast' },
    { title: 'Steak and Eggs', creator: 'Jake Torres', time: '20 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1db10218f-1772446279214.png', alt: 'Classic steak and eggs with sautéed mushrooms and toast', slug: 'steak-and-eggs' },
    { title: 'Coconut Flour Pancakes', creator: 'Aisha Sharma', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c1966aab-1767129915183.png', alt: 'Light and fluffy coconut flour pancakes with fresh berries and maple syrup', slug: 'coconut-flour-pancakes' },
    { title: 'Breakfast Casserole', creator: 'Rosa Gutierrez', time: '1 hr', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1559095253-30e69b68344e", alt: 'Hearty breakfast casserole with sausage, eggs, cheese, and hash browns', slug: 'breakfast-casserole' },
    { title: 'Blueberry Scones', creator: 'Emma Walsh', time: '35 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1470b0d3e-1784881969919.png", alt: 'Flaky blueberry scones with lemon glaze on a baking sheet', slug: 'blueberry-scones' },
    { title: 'Savory Oatmeal', creator: 'Lin Wei', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_184f555da-1772765907328.png", alt: 'Savory oatmeal with soft-boiled egg, soy sauce, and sesame oil', slug: 'savory-oatmeal' },
    { title: 'Croissant Sandwich', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1696721497013-e90103a41bf3", alt: 'Buttery croissant sandwich with ham, brie, and Dijon mustard', slug: 'croissant-sandwich' },
    { title: 'Açaí Smoothie', creator: 'Aisha Sharma', time: '5 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1455099797519-a70bccc199c1', alt: 'Thick açaí smoothie with banana, almond milk, and honey', slug: 'acai-smoothie' },
    { title: 'Loaded Avocado Toast', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18e6c1a9c-1772204197800.png', alt: 'Loaded avocado toast with cherry tomatoes, microgreens, and everything bagel seasoning', slug: 'loaded-avocado-toast' },
    { title: 'Breakfast Bowl', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1729450411363-ba702747e240", alt: 'Nourishing breakfast bowl with quinoa, roasted vegetables, and a poached egg', slug: 'breakfast-bowl' },
    { title: 'Sourdough French Toast', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1623375477518-9d04f307e82b', alt: 'Thick sourdough French toast with caramelized bananas and maple syrup', slug: 'sourdough-french-toast' },
    { title: 'Breakfast Pita', creator: 'Leila Hassan', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1701386196596-5d9ec133fa81", alt: 'Toasted pita filled with scrambled eggs, feta, and fresh herbs', slug: 'breakfast-pita' },
    { title: 'Corn Fritters', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1583503654530-a4ca08800292', alt: 'Golden corn fritters with sour cream and fresh chives', slug: 'corn-fritters' },
    { title: 'Ricotta Toast', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f67ffc13-1772617055021.png", alt: 'Thick toast with whipped ricotta, honey, and fresh figs', slug: 'ricotta-toast' },
    { title: 'Breakfast Galette', creator: 'Emma Walsh', time: '30 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19d5c328b-1785351134901.png", alt: 'Rustic breakfast galette with eggs, cheese, and vegetables in a flaky crust', slug: 'breakfast-galette' },
    { title: 'Mango Lassi', creator: 'Aisha Sharma', time: '5 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bfe36b80-1773120125817.png", alt: 'Creamy mango lassi with yogurt, cardamom, and fresh mango', slug: 'mango-lassi' },
    { title: 'Breakfast Flatbread', creator: 'Leila Hassan', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1029ee0af-1767513117603.png', alt: 'Crispy flatbread topped with hummus, eggs, and za\'atar', slug: 'breakfast-flatbread' },
    { title: 'Oat Waffles', creator: 'Priya Nair', time: '25 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1553699950-29a94e732d8d', alt: 'Crispy oat waffles with fresh berries and a drizzle of honey', slug: 'oat-waffles' }]

  },
  quick: {
    title: 'Ready in 30 Minutes or Less',
    subtitle: 'Fast, delicious meals for busy days',
    recipes: [
    { title: 'Garlic Butter Shrimp Pasta', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f19f6fbe-1775504653966.png', alt: 'Garlic butter shrimp tossed with linguine pasta and fresh parsley', slug: 'garlic-butter-shrimp-pasta' },
    { title: 'Avocado Toast with Poached Egg', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18e6c1a9c-1772204197800.png', alt: 'Thick sourdough toast topped with smashed avocado and a perfectly poached egg', slug: 'avocado-toast-poached-egg' },
    { title: 'Spicy Peanut Noodles', creator: 'Lin Wei', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1222b71f6-1772058167179.png", alt: 'Cold spicy peanut noodles garnished with cucumber, scallions, and sesame seeds', slug: 'spicy-peanut-noodles' },
    { title: 'Sheet Pan Fajitas', creator: 'Carlos Mendez', time: '30 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1679060301613-2ff2050db858', alt: 'Colorful bell peppers and chicken strips roasted on a sheet pan for fajitas', slug: 'sheet-pan-fajitas' },
    { title: 'Caprese Salad', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1725464781841-2d6f9ac10fb2', alt: 'Classic caprese salad with fresh mozzarella, tomatoes, basil and balsamic glaze', slug: 'caprese-salad' },
    { title: 'Egg Fried Rice', creator: 'Lin Wei', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_14631f803-1772367083673.png', alt: 'Wok-tossed egg fried rice with vegetables and soy sauce in a bowl', slug: 'egg-fried-rice' },
    { title: 'Quesadillas', creator: 'Rosa Gutierrez', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1665685278312-89d9f47bb748', alt: 'Crispy cheese quesadillas with salsa and sour cream on a plate', slug: 'quesadillas' },
    { title: 'Tuna Salad Sandwich', creator: 'Emma Walsh', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1659589967239-ac53f6f24c75', alt: 'Classic tuna salad sandwich on toasted bread with lettuce and tomato', slug: 'tuna-salad-sandwich' },
    { title: 'Stir-Fry Vegetables', creator: 'Maria Chen', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1695487528543-347c15018fd6", alt: 'Colorful stir-fried vegetables with garlic and soy sauce in a wok', slug: 'stir-fry-vegetables' },
    { title: 'Greek Salad', creator: 'Sofia Patel', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1597653291869-90564e44078f", alt: 'Fresh Greek salad with cucumber, tomatoes, olives, feta, and oregano', slug: 'greek-salad' },
    { title: 'Chicken Caesar Wrap', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1666819476544-38ea4e57a3d0', alt: 'Grilled chicken Caesar wrap with romaine, parmesan, and Caesar dressing', slug: 'chicken-caesar-wrap' },
    { title: 'Tomato Soup', creator: 'Emma Walsh', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1616537380218-372f4d2830ee", alt: 'Creamy tomato soup with fresh basil and a swirl of cream in a bowl', slug: 'tomato-soup' },
    { title: 'Scrambled Eggs', creator: 'Marco Rossi', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_109193e74-1772618738820.png", alt: 'Perfectly soft scrambled eggs with chives and butter on toast', slug: 'scrambled-eggs' },
    { title: 'BLT Sandwich', creator: 'Jake Torres', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1618650180691-e53a882fb3c0", alt: 'Classic BLT sandwich with crispy bacon, lettuce, and tomato on toasted bread', slug: 'blt-sandwich' },
    { title: 'Pesto Pasta', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1689793601570-7980ac301eca', alt: 'Fresh basil pesto pasta with cherry tomatoes and parmesan cheese', slug: 'pesto-pasta' },
    { title: 'Hummus & Veggie Plate', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1709551665288-d350b7445ae7', alt: 'Creamy hummus with fresh cut vegetables and warm pita bread on a platter', slug: 'hummus-veggie-plate' },
    { title: 'Smash Burger', creator: 'Jake Torres', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_115ac9fe5-1772550917596.png', alt: 'Crispy smash burger with caramelized onions and special sauce on a bun', slug: 'smash-burger' },
    { title: 'Teriyaki Salmon', creator: 'Yuki Tanaka', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_17e323e40-1772187607252.png", alt: 'Glazed teriyaki salmon with steamed rice and sesame seeds', slug: 'teriyaki-salmon' },
    { title: 'Caprese Pasta', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1610817153377-e54299ffdb1e', alt: 'Fresh caprese pasta with cherry tomatoes, mozzarella, and basil', slug: 'caprese-pasta' },
    { title: 'Chicken Stir Fry', creator: 'Lin Wei', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1571872837344-0bcb9f0dcd24', alt: 'Quick chicken stir fry with colorful vegetables and savory sauce', slug: 'chicken-stir-fry' },
    { title: 'Lemon Butter Pasta', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_17e05496a-1771904964499.png", alt: 'Simple lemon butter pasta with parmesan and fresh herbs', slug: 'lemon-butter-pasta' },
    { title: 'Grilled Cheese', creator: 'Emma Walsh', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3', alt: 'Golden grilled cheese sandwich with melted cheddar and sourdough bread', slug: 'grilled-cheese' },
    { title: 'Shrimp Tacos', creator: 'Rosa Gutierrez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1674277196243-ff6fc26e837c", alt: 'Crispy shrimp tacos with cabbage slaw, avocado, and chipotle crema', slug: 'shrimp-tacos' },
    { title: 'Miso Soup', creator: 'Yuki Tanaka', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1258cc50e-1772472349165.png", alt: 'Traditional Japanese miso soup with tofu, wakame seaweed, and green onions', slug: 'miso-soup' },
    { title: 'Veggie Wrap', creator: 'Priya Nair', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1659deaf4-1772094601560.png", alt: 'Fresh veggie wrap with hummus, roasted vegetables, and feta cheese', slug: 'veggie-wrap' },
    { title: 'Fried Rice', creator: 'Lin Wei', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_14631f803-1772367083673.png', alt: 'Classic fried rice with vegetables, egg, and soy sauce in a wok', slug: 'fried-rice' },
    { title: 'Chicken Salad', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1614187860064-8c0442c793c5", alt: 'Classic chicken salad with celery, mayo, and herbs on lettuce', slug: 'chicken-salad' },
    { title: 'Pasta Arrabbiata', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_156bff04d-1772207897368.png', alt: 'Spicy arrabbiata pasta with tomato sauce, garlic, and red chili flakes', slug: 'pasta-arrabbiata' },
    { title: 'Tuna Poke Bowl', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1597958792579-bd3517df6399', alt: 'Fresh tuna poke bowl with sushi rice, edamame, avocado, and sesame dressing', slug: 'tuna-poke-bowl' },
    { title: 'Garlic Bread', creator: 'Marco Rossi', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1690196471135-72cc6a39ee5b", alt: 'Crispy garlic bread with butter, garlic, and fresh parsley', slug: 'garlic-bread' },
    { title: 'Cucumber Salad', creator: 'Yuna Kim', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1719384966291-9eb1b5005f49', alt: 'Refreshing cucumber salad with rice vinegar, sesame oil, and chili flakes', slug: 'cucumber-salad' },
    { title: 'Salmon Rice Bowl', creator: 'Yuna Kim', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1900c313c-1772799440716.png", alt: 'Spicy salmon rice bowl with cucumber, avocado, and sriracha mayo', slug: 'salmon-rice-bowl' },
    { title: 'Omelette', creator: 'Marco Rossi', time: '10 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c29c00e3-1765572953934.png", alt: 'Fluffy French omelette with herbs, cheese, and mushrooms', slug: 'omelette' },
    { title: 'Chickpea Salad', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1573147110754-55d038bee946', alt: 'Mediterranean chickpea salad with cucumber, tomatoes, feta, and herbs', slug: 'chickpea-salad' },
    { title: 'Naan Pizza', creator: 'Aisha Sharma', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a8cb9be7-1768485641350.png", alt: 'Quick naan pizza with tomato sauce, mozzarella, and fresh basil', slug: 'naan-pizza' },
    { title: 'Steak Salad', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1727618534372-ddc94e872d04", alt: 'Sliced steak salad with arugula, cherry tomatoes, and balsamic dressing', slug: 'steak-salad' },
    { title: 'Corn Salad', creator: 'Carlos Mendez', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1719384966291-9eb1b5005f49', alt: 'Mexican street corn salad with cotija cheese, lime, and chili powder', slug: 'corn-salad' },
    { title: 'Fettuccine Alfredo', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1727005217349-66276af3aa7d', alt: 'Creamy fettuccine alfredo with parmesan cheese and fresh parsley', slug: 'fettuccine-alfredo' },
    { title: 'Beef Tacos', creator: 'Rosa Gutierrez', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_10219b7a4-1772055932983.png', alt: 'Seasoned ground beef tacos with cheese, lettuce, and salsa', slug: 'beef-tacos' },
    { title: 'Mushroom Toast', creator: 'Sofia Romano', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fc9b8697-1772468849033.png", alt: 'Sautéed mushrooms on sourdough toast with thyme and parmesan', slug: 'mushroom-toast' },
    { title: 'Watermelon Salad', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1573409157844-6a56035363fc', alt: 'Refreshing watermelon salad with feta, mint, and balsamic glaze', slug: 'watermelon-salad' },
    { title: 'Chicken Fried Rice', creator: 'Lin Wei', time: '25 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_14631f803-1772367083673.png', alt: 'Wok-tossed chicken fried rice with vegetables and soy sauce', slug: 'chicken-fried-rice' },
    { title: 'Bruschetta', creator: 'Sofia Romano', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1725464781841-2d6f9ac10fb2', alt: 'Classic bruschetta with diced tomatoes, basil, and olive oil on toasted bread', slug: 'bruschetta' },
    { title: 'Egg Drop Soup', creator: 'Lin Wei', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19eb07291-1773191218850.png', alt: 'Silky egg drop soup with green onions and sesame oil', slug: 'egg-drop-soup' },
    { title: 'Prawn Stir Fry', creator: 'Maria Chen', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_114d8b130-1772646989517.png", alt: 'Quick prawn stir fry with garlic, ginger, and vegetables', slug: 'prawn-stir-fry' },
    { title: 'Cheese Omelette', creator: 'Marco Rossi', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1609090817330-8dd9b75af6af', alt: 'Fluffy cheese omelette with cheddar and fresh chives', slug: 'cheese-omelette' },
    { title: 'Avocado Salad', creator: 'Priya Nair', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1563213356-6b6f69e01a40", alt: 'Fresh avocado salad with cherry tomatoes, red onion, and lime dressing', slug: 'avocado-salad' },
    { title: 'Soba Noodle Salad', creator: 'Yuki Tanaka', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1626066014976-cd53fe450b3e', alt: 'Cold soba noodle salad with sesame dressing, cucumber, and edamame', slug: 'soba-noodle-salad' },
    { title: 'Loaded Baked Potato', creator: 'Jake Torres', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1559095267-8dbc432dab74', alt: 'Loaded baked potato with sour cream, cheese, bacon, and chives', slug: 'loaded-baked-potato' },
    { title: 'Tomato Basil Soup', creator: 'Emma Walsh', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1629978448078-c94a0ab6500f", alt: 'Creamy tomato basil soup with grilled cheese croutons', slug: 'tomato-basil-soup' }]

  }
};

export default function RecipeSectionPage({ params }: {params: Promise<{section: string;}>;}) {
  const { section } = use(params);
  const data = allSectionData[section];

  if (!data) {
    return (
      <main className="bg-background min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-extrabold text-foreground mb-4">Section not found</h1>
          <p className="text-muted-foreground mb-8">We couldn&apos;t find that recipe section.</p>
          <Link href="/recipes" className="btn-primary">Back to Recipes</Link>
        </div>
        <Footer />
      </main>);

  }

  return (
    <main className="bg-background min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-12 px-4 bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary text-sm font-medium mb-6 transition-colors">
            
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Recipes
          </Link>
          {data.label &&
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{data.label}</p>
          }
          <h1 className="text-hero-lg font-extrabold text-foreground mb-3 tracking-tight">{data.title}</h1>
          {data.subtitle &&
          <p className="text-muted-foreground text-lg max-w-xl">{data.subtitle}</p>
          }
          <p className="text-muted-foreground text-sm mt-3">{data.recipes.length} recipes</p>
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.recipes.map((recipe) =>
          <RecipeCard key={recipe.slug} recipe={recipe} />
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-foreground rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
            Save recipes. Build collections. Cook with Chef Pepe.
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Create your free account to save favourites, build meal plans, and get step-by-step help from Chef Pepe.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/join" className="btn-primary">Join Chew — it&apos;s free</Link>
            <Link href="/recipes" className="btn-secondary border-white/30 text-white hover:bg-white hover:text-foreground">
              Explore all recipes
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>);

}