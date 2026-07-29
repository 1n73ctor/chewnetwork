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
        <img
          src={recipe.image}
          alt={recipe.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {recipe.cuisine &&
        <div className="absolute bottom-3 left-3">
            <span className="text-white text-xs font-bold bg-accent/80 px-2 py-1 rounded-full">{recipe.cuisine}</span>
          </div>
        }
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-foreground hover:bg-white transition-colors"
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
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth={2} />
                  <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
                </svg>
                {recipe.time}
              </span>
          }
            {recipe.difficulty &&
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          recipe.difficulty === 'Easy' ? 'bg-muted text-primary' :
          recipe.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-secondary text-accent'}`
          }>
                {recipe.difficulty}
              </span>
          }
          </div>
        }
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
    { title: 'One-Pan Lemon Orzo', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19e8d5be5-1772085887052.png", alt: 'Creamy lemon orzo pasta with spinach and parmesan in a cast iron pan', slug: 'one-pan-lemon-orzo' },
    { title: 'Korean Corn Dogs', creator: 'Yuna Kim', time: '35 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1eead6026-1771887177210.png', alt: 'Korean-style corn dogs coated in crispy batter with sugar and ketchup drizzle', slug: 'korean-corn-dogs' },
    { title: 'Mango Coconut Chia Pudding', creator: 'Priya Nair', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1629180050285-7c56c6671f19', alt: 'Layered mango coconut chia pudding in a glass jar topped with fresh mango slices', slug: 'mango-coconut-chia-pudding' },
    { title: 'Birria Tacos', creator: 'Rosa Gutierrez', time: '3 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_10219b7a4-1772055932983.png", alt: 'Crispy birria tacos dipped in rich consommé with melted cheese and cilantro', slug: 'birria-tacos' },
    { title: 'Viral Feta Pasta', creator: 'Emma Walsh', time: '40 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1493151333614-26ed2c07f9c6", alt: 'Baked feta pasta with cherry tomatoes and fresh basil in a baking dish', slug: 'viral-feta-pasta' },
    { title: 'Butter Board', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1589310209417-a496eea2eac0", alt: 'Whipped butter spread on a wooden board with honey, herbs, and edible flowers', slug: 'butter-board' },
    { title: 'Crispy Rice Salad', creator: 'Maria Chen', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1719910327777-a2489921021a", alt: 'Crispy fried rice topped with fresh vegetables and sesame dressing in a bowl', slug: 'crispy-rice-salad' },
    { title: 'Marry Me Chicken', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f79e6ddb-1772630172931.png", alt: 'Creamy sun-dried tomato chicken in a cast iron skillet with fresh basil', slug: 'marry-me-chicken' },
    { title: 'Cottage Cheese Flatbread', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1029ee0af-1767513117603.png", alt: 'Golden cottage cheese flatbread with herbs and toppings on a baking sheet', slug: 'cottage-cheese-flatbread' },
    { title: 'Cucumber Salad', creator: 'Yuna Kim', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1719384966291-9eb1b5005f49", alt: 'Refreshing cucumber salad with rice vinegar, sesame oil, and chili flakes', slug: 'cucumber-salad' },
    { title: 'Whipped Feta Dip', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1646587433838-0159a05ba4d7", alt: 'Creamy whipped feta dip with olive oil, honey, and fresh herbs on a plate', slug: 'whipped-feta-dip' }]

  },
  breakfast: {
    title: 'Breakfast & Brunch',
    label: 'Morning meals',
    subtitle: 'Start your day the delicious way',
    recipes: [
    { title: 'Fluffy Buttermilk Pancakes', creator: 'Emma Walsh', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c1966aab-1767129915183.png', alt: 'Stack of fluffy golden buttermilk pancakes with maple syrup and fresh berries', slug: 'fluffy-buttermilk-pancakes' },
    { title: 'Eggs Benedict', creator: 'Marco Rossi', time: '25 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1890ea5f7-1772766498216.png', alt: 'Classic eggs benedict with hollandaise sauce on toasted English muffin', slug: 'eggs-benedict' },
    { title: 'Overnight Oats', creator: 'Priya Nair', time: '5 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d3c8d39-1772083435970.png', alt: 'Creamy overnight oats in a mason jar topped with fresh fruit and nuts', slug: 'overnight-oats' },
    { title: 'French Toast', creator: 'Sofia Patel', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1623375477518-9d04f307e82b', alt: 'Golden thick-cut French toast dusted with powdered sugar and fresh strawberries', slug: 'french-toast' },
    { title: 'Breakfast Burrito', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_116ccbc83-1772393582608.png', alt: 'Loaded breakfast burrito with scrambled eggs, cheese, salsa, and avocado', slug: 'breakfast-burrito' },
    { title: 'Acai Bowl', creator: 'Aisha Sharma', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1455099797519-a70bccc199c1', alt: 'Vibrant purple acai bowl topped with granola, banana slices, and honey drizzle', slug: 'acai-bowl' },
    { title: 'Shakshuka', creator: 'Leila Hassan', time: '25 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e54a3842-1783627091192.png', alt: 'Eggs poached in spiced tomato and pepper sauce in a cast iron skillet', slug: 'shakshuka' },
    { title: 'Avocado Toast with Poached Egg', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18e6c1a9c-1772204197800.png', alt: 'Thick sourdough toast topped with smashed avocado and a perfectly poached egg', slug: 'avocado-toast-poached-egg' },
    { title: 'Banana Pancakes', creator: 'Priya Nair', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1583503654530-a4ca08800292", alt: 'Golden banana pancakes stacked with maple syrup and sliced bananas', slug: 'banana-pancakes' },
    { title: 'Smoked Salmon Bagel', creator: 'Maria Chen', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1680602573288-5a8fa0ed397d", alt: 'Everything bagel with cream cheese, smoked salmon, capers, and red onion', slug: 'smoked-salmon-bagel' },
    { title: 'Greek Yogurt Parfait', creator: 'Sofia Patel', time: '5 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1691455653742-ea1aded33376", alt: 'Layered Greek yogurt parfait with granola, fresh berries, and honey in a glass', slug: 'greek-yogurt-parfait' },
    { title: 'Breakfast Hash', creator: 'Jake Torres', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1559095267-8dbc432dab74", alt: 'Crispy potato breakfast hash with peppers, onions, and fried eggs on top', slug: 'breakfast-hash' },
    { title: 'Crepes', creator: 'Sofia Romano', time: '30 min', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1731185168371-d7da504f3df2", alt: 'Thin golden crepes folded with strawberries and whipped cream on a white plate', slug: 'crepes' },
    { title: 'Granola from Scratch', creator: 'Emma Walsh', time: '35 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1498560966227-924b32ce2feb", alt: 'Crunchy homemade granola with oats, nuts, seeds, and dried fruit on a baking sheet', slug: 'granola-from-scratch' },
    { title: 'Breakfast Quesadilla', creator: 'Carlos Mendez', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_10b8ab986-1777253207789.png", alt: 'Crispy breakfast quesadilla filled with scrambled eggs, cheese, and salsa', slug: 'breakfast-quesadilla' },
    { title: 'Waffles', creator: 'Emma Walsh', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1553699950-29a94e732d8d", alt: 'Crispy golden waffles with fresh berries, whipped cream, and maple syrup', slug: 'waffles' }]

  },
  quick: {
    title: 'Ready in 30 Minutes or Less',
    subtitle: 'Fast, delicious meals for busy days',
    recipes: [
    { title: 'Garlic Butter Shrimp Pasta', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f19f6fbe-1775504653966.png', alt: 'Garlic butter shrimp tossed with linguine pasta and fresh parsley', slug: 'garlic-butter-shrimp-pasta' },
    { title: 'Avocado Toast with Poached Egg', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18e6c1a9c-1772204197800.png', alt: 'Thick sourdough toast topped with smashed avocado and a perfectly poached egg', slug: 'avocado-toast-poached-egg' },
    { title: 'Spicy Peanut Noodles', creator: 'Lin Wei', time: '25 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1626066014976-cd53fe450b3e', alt: 'Cold spicy peanut noodles garnished with cucumber, scallions, and sesame seeds', slug: 'spicy-peanut-noodles' },
    { title: 'Sheet Pan Fajitas', creator: 'Carlos Mendez', time: '30 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1679060301613-2ff2050db858', alt: 'Colorful bell peppers and chicken strips roasted on a sheet pan for fajitas', slug: 'sheet-pan-fajitas' },
    { title: 'Caprese Salad', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1725464781841-2d6f9ac10fb2', alt: 'Classic caprese salad with fresh mozzarella, tomatoes, basil and balsamic glaze', slug: 'caprese-salad' },
    { title: 'Egg Fried Rice', creator: 'Lin Wei', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_14631f803-1772367083673.png', alt: 'Wok-tossed egg fried rice with vegetables and soy sauce in a bowl', slug: 'egg-fried-rice' },
    { title: 'Quesadillas', creator: 'Rosa Gutierrez', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1665685278312-89d9f47bb748", alt: 'Crispy cheese quesadillas with salsa and sour cream on a plate', slug: 'quesadillas' },
    { title: 'Tuna Salad Sandwich', creator: 'Emma Walsh', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1659589967239-ac53f6f24c75", alt: 'Classic tuna salad sandwich on toasted bread with lettuce and tomato', slug: 'tuna-salad-sandwich' },
    { title: 'Stir-Fry Vegetables', creator: 'Maria Chen', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1571872837344-0bcb9f0dcd24", alt: 'Colorful stir-fried vegetables with garlic and soy sauce in a wok', slug: 'stir-fry-vegetables' },
    { title: 'Greek Salad', creator: 'Sofia Patel', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1573409157844-6a56035363fc", alt: 'Fresh Greek salad with cucumber, tomatoes, olives, feta, and oregano', slug: 'greek-salad' },
    { title: 'Chicken Caesar Wrap', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1666819476544-38ea4e57a3d0", alt: 'Grilled chicken Caesar wrap with romaine, parmesan, and Caesar dressing', slug: 'chicken-caesar-wrap' },
    { title: 'Tomato Soup', creator: 'Emma Walsh', time: '25 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1529566260205-50597c058463", alt: 'Creamy tomato soup with fresh basil and a swirl of cream in a bowl', slug: 'tomato-soup' },
    { title: 'Scrambled Eggs', creator: 'Marco Rossi', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1609090817330-8dd9b75af6af", alt: 'Perfectly soft scrambled eggs with chives and butter on toast', slug: 'scrambled-eggs' },
    { title: 'BLT Sandwich', creator: 'Jake Torres', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3", alt: 'Classic BLT sandwich with crispy bacon, lettuce, and tomato on toasted bread', slug: 'blt-sandwich' },
    { title: 'Pesto Pasta', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1689793601570-7980ac301eca", alt: 'Fresh basil pesto pasta with cherry tomatoes and parmesan cheese', slug: 'pesto-pasta' },
    { title: 'Hummus & Veggie Plate', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1709551665288-d350b7445ae7", alt: 'Creamy hummus with fresh cut vegetables and warm pita bread on a platter', slug: 'hummus-veggie-plate' }]

  },
  global: {
    title: 'Cook Around the World',
    subtitle: 'Explore cuisines from every corner of the globe',
    recipes: [
    { title: 'Chicken Tikka Masala', creator: 'Aisha Sharma', cuisine: 'Indian', time: '45 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1657205937641-01d8c906274f', alt: 'Rich and creamy chicken tikka masala in a bowl with naan bread on the side', slug: 'chicken-tikka-masala' },
    { title: 'Beef Pho', creator: 'Nguyen Lan', cuisine: 'Vietnamese', time: '3 hrs', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1707153438523-3d32f2bed0f3', alt: 'Steaming bowl of Vietnamese beef pho with rice noodles, herbs, and bean sprouts', slug: 'beef-pho' },
    { title: 'Shakshuka', creator: 'Leila Hassan', cuisine: 'Middle Eastern', time: '25 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e54a3842-1783627091192.png', alt: 'Eggs poached in spiced tomato and pepper sauce in a cast iron skillet', slug: 'shakshuka' },
    { title: 'Tacos al Pastor', creator: 'Rosa Gutierrez', cuisine: 'Mexican', time: '2 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f6aa0250-1772893483543.png', alt: 'Authentic tacos al pastor with marinated pork, pineapple, cilantro, and onion', slug: 'tacos-al-pastor' },
    { title: 'Pad Thai', creator: 'Somchai Wongsa', cuisine: 'Thai', time: '30 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1663905494561-f70d406eff0d', alt: 'Classic pad thai noodles with shrimp, bean sprouts, peanuts, and lime wedge', slug: 'pad-thai' },
    { title: 'Bibimbap', creator: 'Min-Jun Oh', cuisine: 'Korean', time: '40 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1733231323270-82dd8a5efe4b', alt: 'Colorful Korean bibimbap bowl with rice, vegetables, egg, and gochujang sauce', slug: 'bibimbap' },
    { title: 'Sushi Rolls', creator: 'Yuki Tanaka', cuisine: 'Japanese', time: '1 hr', difficulty: 'Hard', image: "https://images.unsplash.com/photo-1583843870264-11917bb96aaf", alt: 'Assorted homemade sushi rolls with salmon, tuna, and avocado on a wooden board', slug: 'sushi-rolls' },
    { title: 'Moussaka', creator: 'Sofia Patel', cuisine: 'Greek', time: '1.5 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1762ed9e0-1764717381734.png", alt: 'Layered Greek moussaka with eggplant, spiced meat, and béchamel sauce', slug: 'moussaka' },
    { title: 'Jerk Chicken', creator: 'Marcus Williams', cuisine: 'Jamaican', time: '2 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_190151885-1775930541867.png", alt: 'Smoky Jamaican jerk chicken with scotch bonnet peppers and allspice on a grill', slug: 'jerk-chicken' },
    { title: 'Butter Chicken', creator: 'Aisha Sharma', cuisine: 'Indian', time: '50 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18c6478cb-1772187609323.png", alt: 'Creamy butter chicken curry with tender chicken pieces and aromatic spices', slug: 'butter-chicken' },
    { title: 'Paella', creator: 'Carlos Mendez', cuisine: 'Spanish', time: '1 hr', difficulty: 'Hard', image: "https://img.rocket.new/generatedImages/rocket_gen_img_15f1feaab-1765078561441.png", alt: 'Traditional Spanish paella with saffron rice, seafood, and chorizo in a pan', slug: 'paella' },
    { title: 'Peking Duck', creator: 'Lin Wei', cuisine: 'Chinese', time: '4 hrs', difficulty: 'Hard', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1cf557f58-1781561352458.png", alt: 'Crispy Peking duck with thin pancakes, hoisin sauce, and cucumber strips', slug: 'peking-duck' },
    { title: 'Falafel', creator: 'Leila Hassan', cuisine: 'Middle Eastern', time: '30 min', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1680990999782-ba7fe26e4d0b", alt: 'Crispy golden falafel balls with tahini sauce and fresh herbs', slug: 'falafel' },
    { title: 'Tom Yum Soup', creator: 'Somchai Wongsa', cuisine: 'Thai', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1720786913374-d9c9da9f21a3", alt: 'Spicy and sour Thai tom yum soup with shrimp, mushrooms, and lemongrass', slug: 'tom-yum-soup' },
    { title: 'Beef Bulgogi', creator: 'Min-Jun Oh', cuisine: 'Korean', time: '30 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f028ab6b-1779993139967.png", alt: 'Marinated Korean beef bulgogi with sesame seeds and green onions over rice', slug: 'beef-bulgogi' },
    { title: 'Tagine', creator: 'Leila Hassan', cuisine: 'Moroccan', time: '2 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_156f113fe-1772079177114.png", alt: 'Slow-cooked Moroccan lamb tagine with apricots, almonds, and aromatic spices', slug: 'tagine' }]

  },
  pasta: {
    title: 'Pasta & Noodles',
    label: 'Comfort food',
    subtitle: 'From classic Italian to Asian noodle bowls',
    recipes: [
    { title: 'Cacio e Pepe', creator: 'Sofia Romano', time: '20 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e568055d-1772085885754.png', alt: 'Creamy cacio e pepe pasta with black pepper and pecorino romano cheese', slug: 'cacio-e-pepe' },
    { title: 'Pesto Gnocchi', creator: 'Marco Rossi', time: '25 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a38c4769-1784801278829.png', alt: 'Pillowy gnocchi tossed in vibrant green basil pesto with pine nuts', slug: 'pesto-gnocchi' },
    { title: 'Pasta Arrabbiata', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_156bff04d-1772207897368.png', alt: 'Spicy arrabbiata pasta with tomato sauce, garlic, and red chili flakes', slug: 'pasta-arrabbiata' },
    { title: 'Mushroom Risotto', creator: 'Maria Chen', time: '40 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1680420574628-225def8eea0a', alt: 'Creamy mushroom risotto with parmesan cheese and fresh thyme garnish', slug: 'mushroom-risotto' },
    { title: 'Baked Mac & Cheese', creator: 'Jake Torres', time: '45 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1beb1562f-1772222748789.png', alt: 'Golden baked macaroni and cheese with crispy breadcrumb topping', slug: 'baked-mac-cheese' },
    { title: 'Spaghetti Bolognese', creator: 'Marco Rossi', time: '1 hr', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1662478840028-ae0c032f8ba1", alt: 'Classic spaghetti bolognese with rich meat sauce and parmesan cheese', slug: 'spaghetti-bolognese' },
    { title: 'Carbonara', creator: 'Sofia Romano', time: '25 min', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1465971784517-69774141c40f", alt: 'Silky spaghetti carbonara with guanciale, egg yolk, and pecorino cheese', slug: 'carbonara' },
    { title: 'Pad Thai', creator: 'Somchai Wongsa', time: '30 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1663905494561-f70d406eff0d', alt: 'Classic pad thai noodles with shrimp, bean sprouts, peanuts, and lime wedge', slug: 'pad-thai' },
    { title: 'Ramen from Scratch', creator: 'Yuna Kim', time: '3 hrs', difficulty: 'Hard', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_16fa22663-1772767892756.png', alt: 'Rich tonkotsu ramen with chashu pork, soft-boiled egg, and nori', slug: 'ramen-from-scratch' },
    { title: 'Lasagna', creator: 'Maria Chen', time: '2 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18ea24141-1772646976917.png', alt: 'Layered classic lasagna with meat sauce and bubbling mozzarella cheese', slug: 'classic-lasagna' },
    { title: 'Fettuccine Alfredo', creator: 'Marco Rossi', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1727005217349-66276af3aa7d", alt: 'Creamy fettuccine alfredo with parmesan cheese and fresh parsley', slug: 'fettuccine-alfredo' },
    { title: 'Spicy Peanut Noodles', creator: 'Lin Wei', time: '25 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1626066014976-cd53fe450b3e', alt: 'Cold spicy peanut noodles garnished with cucumber, scallions, and sesame seeds', slug: 'spicy-peanut-noodles' },
    { title: 'Penne alla Vodka', creator: 'Sofia Romano', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1662197480393-2a82030b7b83", alt: 'Creamy penne alla vodka with tomato sauce, cream, and fresh basil', slug: 'penne-alla-vodka' },
    { title: 'Udon Stir Fry', creator: 'Yuki Tanaka', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1714670138475-d99c10b94d08", alt: 'Thick udon noodles stir-fried with vegetables, egg, and savory sauce', slug: 'udon-stir-fry' },
    { title: 'Pasta Primavera', creator: 'Emma Walsh', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dbd5520a-1765103408736.png", alt: 'Light pasta primavera with seasonal vegetables, olive oil, and parmesan', slug: 'pasta-primavera' },
    { title: 'Orecchiette with Sausage', creator: 'Marco Rossi', time: '30 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927', alt: 'Orecchiette pasta with Italian sausage, broccoli rabe, and chili flakes', slug: 'orecchiette-sausage' }]

  },
  healthy: {
    title: 'Healthy Choices',
    subtitle: 'Fresh, balanced, and full of flavor',
    recipes: [
    { title: 'Rainbow Buddha Bowl', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13da08aa3-1772139613628.png', alt: 'Colorful buddha bowl with roasted vegetables, quinoa, and tahini dressing', slug: 'rainbow-buddha-bowl' },
    { title: 'Zucchini Noodles with Pesto', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19ed2983c-1768144943727.png', alt: 'Spiralized zucchini noodles tossed with fresh basil pesto and cherry tomatoes', slug: 'zucchini-noodles-pesto' },
    { title: 'Grilled Chicken & Quinoa', creator: 'Sofia Patel', time: '30 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1105e39ee-1784981318339.png', alt: 'Grilled chicken breast sliced over fluffy quinoa with roasted vegetables', slug: 'grilled-chicken-quinoa' },
    { title: 'Berry Smoothie Bowl', creator: 'Aisha Sharma', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1664467488537-e570dfede89f", alt: 'Thick acai smoothie bowl topped with fresh berries, granola, and coconut flakes', slug: 'berry-smoothie-bowl' },
    { title: 'Salmon & Avocado Salad', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1300967e4-1773173912136.png', alt: 'Fresh salmon salad with avocado, mixed greens, and lemon vinaigrette', slug: 'salmon-avocado-salad' },
    { title: 'Lentil Soup', creator: 'Leila Hassan', time: '35 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a176c584-1782375166859.png', alt: 'Hearty red lentil soup with cumin, turmeric, and fresh lemon in a bowl', slug: 'lentil-soup' },
    { title: 'Kale Caesar Salad', creator: 'Emma Walsh', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eb059b55-1772309798472.png", alt: 'Massaged kale Caesar salad with homemade dressing, croutons, and parmesan', slug: 'kale-caesar-salad' },
    { title: 'Cauliflower Fried Rice', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1569cdc2a-1772801887803.png", alt: 'Low-carb cauliflower fried rice with vegetables, egg, and soy sauce', slug: 'cauliflower-fried-rice' },
    { title: 'Baked Cod with Herbs', creator: 'Maria Chen', time: '25 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_13eaf2a0e-1772075169862.png", alt: 'Flaky baked cod with lemon, herbs, and olive oil on a baking sheet', slug: 'baked-cod-herbs' },
    { title: 'Turkey Lettuce Wraps', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_125c7b935-1767189119850.png", alt: 'Asian-style turkey lettuce wraps with water chestnuts and hoisin sauce', slug: 'turkey-lettuce-wraps' },
    { title: 'Overnight Oats', creator: 'Priya Nair', time: '5 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13d3c8d39-1772083435970.png', alt: 'Creamy overnight oats in a mason jar topped with fresh fruit and nuts', slug: 'overnight-oats' },
    { title: 'Chickpea Salad', creator: 'Leila Hassan', time: '10 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1573147110754-55d038bee946", alt: 'Mediterranean chickpea salad with cucumber, tomatoes, feta, and herbs', slug: 'chickpea-salad' },
    { title: 'Baked Sweet Potato', creator: 'Aisha Sharma', time: '45 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_112a24bb3-1770495264791.png", alt: 'Baked sweet potato loaded with black beans, avocado, and Greek yogurt', slug: 'baked-sweet-potato' },
    { title: 'Green Smoothie', creator: 'Sofia Patel', time: '5 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_15d57a6dc-1764659987526.png", alt: 'Vibrant green smoothie with spinach, banana, mango, and almond milk', slug: 'green-smoothie' },
    { title: 'Tuna Poke Bowl', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1597958792579-bd3517df6399", alt: 'Fresh tuna poke bowl with sushi rice, edamame, avocado, and sesame dressing', slug: 'tuna-poke-bowl' },
    { title: 'Roasted Vegetable Bowl', creator: 'Emma Walsh', time: '35 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13da08aa3-1772139613628.png', alt: 'Colorful roasted vegetable grain bowl with tahini dressing and seeds', slug: 'roasted-vegetable-bowl' }]

  },
  vegetarian: {
    title: 'Vegetarian Favorites',
    label: 'Plant-based',
    subtitle: 'Satisfying meals without the meat',
    recipes: [
    { title: 'Stuffed Bell Peppers', creator: 'Leila Hassan', time: '45 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1706222173694-5264de2d23d9', alt: 'Colorful stuffed bell peppers filled with rice, vegetables, and melted cheese', slug: 'stuffed-bell-peppers' },
    { title: 'Vegetable Curry', creator: 'Aisha Sharma', time: '35 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e18a70fe-1772793496599.png", alt: 'Fragrant vegetable curry with chickpeas, spinach, and coconut milk', slug: 'vegetable-curry' },
    { title: 'Caprese Pasta', creator: 'Sofia Romano', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1610817153377-e54299ffdb1e', alt: 'Fresh caprese pasta with cherry tomatoes, mozzarella, and basil', slug: 'caprese-pasta' },
    { title: 'Falafel Wrap', creator: 'Leila Hassan', time: '30 min', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1636168655089-5e625a233354', alt: 'Crispy falafel wrap with hummus, vegetables, and tahini sauce', slug: 'falafel-wrap' },
    { title: 'Margherita Pizza', creator: 'Marco Rossi', time: '30 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19c9e1395-1767818009181.png", alt: 'Classic margherita pizza with fresh mozzarella, tomato sauce, and basil leaves', slug: 'margherita-pizza' },
    { title: 'Mushroom Tacos', creator: 'Rosa Gutierrez', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1721001309902-939443092f13', alt: 'Savory mushroom tacos with chipotle sauce, avocado, and pickled onions', slug: 'mushroom-tacos' },
    { title: 'Shakshuka', creator: 'Leila Hassan', time: '25 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e54a3842-1783627091192.png', alt: 'Eggs poached in spiced tomato and pepper sauce in a cast iron skillet', slug: 'shakshuka' },
    { title: 'Eggplant Parmesan', creator: 'Sofia Romano', time: '1 hr', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1584946763396-88121cf27070", alt: 'Layered eggplant parmesan with marinara sauce and melted mozzarella cheese', slug: 'eggplant-parmesan' },
    { title: 'Black Bean Burgers', creator: 'Jake Torres', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1495557622555-a00e1615ef68", alt: 'Hearty black bean burgers with avocado, lettuce, and chipotle mayo', slug: 'black-bean-burgers' },
    { title: 'Lentil Dal', creator: 'Aisha Sharma', time: '40 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1708782344330-44ca4786d1e5", alt: 'Comforting red lentil dal with aromatic spices and fresh cilantro', slug: 'lentil-dal' },
    { title: 'Caprese Salad', creator: 'Sofia Romano', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1725464781841-2d6f9ac10fb2', alt: 'Classic caprese salad with fresh mozzarella, tomatoes, basil and balsamic glaze', slug: 'caprese-salad' },
    { title: 'Veggie Stir Fry', creator: 'Lin Wei', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e18a70fe-1772793496599.png", alt: 'Colorful vegetable stir fry with tofu, broccoli, and savory sauce over rice', slug: 'veggie-stir-fry' },
    { title: 'Spinach Quiche', creator: 'Emma Walsh', time: '1 hr', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1603205614172-612e82c70155", alt: 'Golden spinach and cheese quiche with flaky pastry crust', slug: 'spinach-quiche' },
    { title: 'Roasted Cauliflower', creator: 'Priya Nair', time: '35 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_101becccb-1772081330932.png", alt: 'Golden roasted cauliflower with turmeric, cumin, and fresh herbs', slug: 'roasted-cauliflower' },
    { title: 'Butternut Squash Soup', creator: 'Emma Walsh', time: '45 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_175a92cd6-1772529808634.png", alt: 'Velvety butternut squash soup with cream, nutmeg, and toasted pumpkin seeds', slug: 'butternut-squash-soup' },
    { title: 'Veggie Quesadillas', creator: 'Rosa Gutierrez', time: '20 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1617904116128-f55dd979f087", alt: 'Crispy vegetable quesadillas with black beans, corn, peppers, and cheese', slug: 'veggie-quesadillas' }]

  },
  bbq: {
    title: 'BBQ & Grilling',
    label: 'Fire it up',
    subtitle: 'Low and slow, or hot and fast',
    recipes: [
    { title: 'BBQ Baby Back Ribs', creator: 'Jake Torres', time: '3 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1c57cdb81-1770832572556.png', alt: 'Smoky BBQ baby back ribs with caramelized sauce on a wooden board', slug: 'bbq-baby-back-ribs' },
    { title: 'Grilled Corn on the Cob', creator: 'Carlos Mendez', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_10e7a9445-1784921100998.png", alt: 'Charred grilled corn on the cob with butter, lime, and chili powder', slug: 'grilled-corn' },
    { title: 'Smoked Brisket', creator: 'Jake Torres', time: '8 hrs', difficulty: 'Hard', image: "https://img.rocket.new/generatedImages/rocket_gen_img_167e703b7-1773184192669.png", alt: 'Thick sliced smoked brisket with dark bark and pink smoke ring', slug: 'smoked-brisket' },
    { title: 'Grilled Veggie Skewers', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f19f6fbe-1775504653966.png", alt: 'Colorful grilled vegetable skewers with zucchini, peppers, and mushrooms', slug: 'grilled-veggie-skewers' },
    { title: 'Pulled Pork Sandwiches', creator: 'Carlos Mendez', time: '6 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1557b105b-1773111482327.png', alt: 'Tender pulled pork piled high on a brioche bun with coleslaw', slug: 'pulled-pork-sandwiches' },
    { title: 'Grilled Salmon Fillet', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1693164224779-9a7a8fc7b6d2', alt: 'Perfectly grilled salmon fillet with lemon and herbs on a grill', slug: 'grilled-salmon-fillet' },
    { title: 'Smash Burgers', creator: 'Jake Torres', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_115ac9fe5-1772550917596.png", alt: 'Crispy smash burgers with caramelized onions, cheese, and special sauce', slug: 'smash-burgers' },
    { title: 'Grilled Chicken Thighs', creator: 'Carlos Mendez', time: '30 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_18f2d54d0-1772058485742.png", alt: 'Juicy grilled chicken thighs with herb marinade and char marks', slug: 'grilled-chicken-thighs' },
    { title: 'BBQ Chicken Pizza', creator: 'Jake Torres', time: '35 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1727420863487-bd78c8d4e233", alt: 'BBQ chicken pizza with red onion, cilantro, and smoky barbecue sauce', slug: 'bbq-chicken-pizza' },
    { title: 'Grilled Shrimp Skewers', creator: 'Maria Chen', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1635882686740-edfc701b48ae', alt: 'Juicy grilled shrimp skewers with garlic butter and fresh lemon', slug: 'grilled-shrimp-skewers' },
    { title: 'Smoked Pulled Chicken', creator: 'Jake Torres', time: '4 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_131efbc0c-1785345968913.png", alt: 'Tender smoked pulled chicken with tangy BBQ sauce on a bun', slug: 'smoked-pulled-chicken' },
    { title: 'Grilled Portobello Mushrooms', creator: 'Priya Nair', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eec6e5c1-1775093621614.png", alt: 'Marinated grilled portobello mushrooms with balsamic glaze and herbs', slug: 'grilled-portobello' },
    { title: 'BBQ Baked Beans', creator: 'Carlos Mendez', time: '2 hrs', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ca561c43-1785345968668.png", alt: 'Smoky BBQ baked beans with bacon, brown sugar, and molasses', slug: 'bbq-baked-beans' },
    { title: 'Grilled Pineapple', creator: 'Rosa Gutierrez', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1570716774271-ab30ad4924a8', alt: 'Caramelized grilled pineapple slices with cinnamon and brown sugar', slug: 'grilled-pineapple' },
    { title: 'Smoked Mac & Cheese', creator: 'Jake Torres', time: '2 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1beb1562f-1772222748789.png', alt: 'Creamy smoked mac and cheese with crispy breadcrumb topping from the smoker', slug: 'smoked-mac-cheese' },
    { title: 'Grilled Lamb Chops', creator: 'Leila Hassan', time: '25 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_131151dcb-1770175322852.png", alt: 'Herb-marinated grilled lamb chops with mint sauce and roasted vegetables', slug: 'grilled-lamb-chops' }]

  },
  soups: {
    title: 'Soups & Stews',
    label: 'Warm up',
    subtitle: 'Bowl food for every season',
    recipes: [
    { title: 'Tomato Bisque', creator: 'Emma Walsh', time: '30 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1616537380218-372f4d2830ee', alt: 'Creamy roasted tomato bisque with fresh basil and a swirl of cream', slug: 'tomato-bisque' },
    { title: 'French Onion Soup', creator: 'Sofia Romano', time: '1 hr', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13b832fd6-1772088178489.png', alt: 'Classic French onion soup with caramelized onions and melted gruyere crouton', slug: 'french-onion-soup' },
    { title: 'Ramen from Scratch', creator: 'Yuna Kim', time: '3 hrs', difficulty: 'Hard', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_16fa22663-1772767892756.png', alt: 'Rich tonkotsu ramen with chashu pork, soft-boiled egg, and nori', slug: 'ramen-from-scratch' },
    { title: 'Minestrone', creator: 'Marco Rossi', time: '45 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e2f801ab-1773084071073.png', alt: 'Hearty Italian minestrone soup with vegetables, beans, and pasta', slug: 'minestrone' },
    { title: 'Clam Chowder', creator: 'Maria Chen', time: '40 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_10ba1c7d1-1773382873021.png", alt: 'Creamy New England clam chowder with potatoes and crispy bacon bits', slug: 'clam-chowder' },
    { title: 'Miso Soup', creator: 'Yuki Tanaka', time: '10 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19eb07291-1773191218850.png', alt: 'Traditional Japanese miso soup with tofu, wakame seaweed, and green onions', slug: 'miso-soup' },
    { title: 'Beef Stew', creator: 'Jake Torres', time: '2 hrs', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1569603389904-f1dd0c74b504", alt: 'Rich beef stew with carrots, potatoes, and herbs in a deep pot', slug: 'beef-stew' },
    { title: 'Chicken Noodle Soup', creator: 'Rosa Gutierrez', time: '1 hr', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1727417376054-a3a6d6f31999', alt: 'Comforting homemade chicken noodle soup with vegetables in a white bowl', slug: 'chicken-noodle-soup' },
    { title: 'Lentil Soup', creator: 'Leila Hassan', time: '35 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1a176c584-1782375166859.png', alt: 'Hearty red lentil soup with cumin, turmeric, and fresh lemon in a bowl', slug: 'lentil-soup' },
    { title: 'Tom Yum Soup', creator: 'Somchai Wongsa', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1720786913374-d9c9da9f21a3", alt: 'Spicy and sour Thai tom yum soup with shrimp, mushrooms, and lemongrass', slug: 'tom-yum-soup' },
    { title: 'Butternut Squash Soup', creator: 'Emma Walsh', time: '45 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_175a92cd6-1772529808634.png", alt: 'Velvety butternut squash soup with cream, nutmeg, and toasted pumpkin seeds', slug: 'butternut-squash-soup' },
    { title: 'Pho Bo', creator: 'Nguyen Lan', time: '3 hrs', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1707153438523-3d32f2bed0f3', alt: 'Steaming bowl of Vietnamese beef pho with rice noodles, herbs, and bean sprouts', slug: 'beef-pho' },
    { title: 'Gazpacho', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1616537380218-372f4d2830ee', alt: 'Chilled Spanish gazpacho with fresh tomatoes, cucumber, and olive oil', slug: 'gazpacho' },
    { title: 'Lobster Bisque', creator: 'Maria Chen', time: '1 hr', difficulty: 'Hard', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_166dafed2-1773214700374.png', alt: 'Rich and creamy lobster bisque with sherry, cream, and fresh chives', slug: 'lobster-bisque' },
    { title: 'Pozole', creator: 'Rosa Gutierrez', time: '2 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_19a67f63c-1775930541864.png", alt: 'Traditional Mexican pozole with hominy, pork, and red chile broth', slug: 'pozole' },
    { title: 'Mulligatawny', creator: 'Aisha Sharma', time: '45 min', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1084c5985-1785345967713.png", alt: 'Spiced Indian-inspired mulligatawny soup with lentils, apple, and coconut milk', slug: 'mulligatawny' }]

  },
  'air-fryer': {
    title: 'Air Fryer Recipes',
    label: 'Crispy & quick',
    subtitle: 'Crispy results with less oil',
    recipes: [
    { title: 'Air Fryer Chicken Wings', creator: 'Jake Torres', time: '25 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1dc41e977-1772091572034.png', alt: 'Crispy air fryer chicken wings with buffalo sauce and blue cheese dip', slug: 'air-fryer-chicken-wings' },
    { title: 'Air Fryer French Fries', creator: 'Carlos Mendez', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1601592430325-e0e1551b48ef', alt: 'Golden crispy air fryer french fries with sea salt in a paper cone', slug: 'air-fryer-french-fries' },
    { title: 'Air Fryer Salmon', creator: 'Maria Chen', time: '12 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_13cb601db-1782924149319.png', alt: 'Perfectly cooked air fryer salmon with lemon and dill garnish', slug: 'air-fryer-salmon' },
    { title: 'Air Fryer Donuts', creator: 'Emma Walsh', time: '20 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1fd488982-1772716945970.png", alt: 'Fluffy air fryer donuts with glaze and colorful sprinkles', slug: 'air-fryer-donuts' },
    { title: 'Air Fryer Vegetables', creator: 'Priya Nair', time: '15 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1b3a1542b-1772084616223.png', alt: 'Crispy roasted air fryer vegetables with olive oil and herbs', slug: 'air-fryer-vegetables' },
    { title: 'Air Fryer Steak', creator: 'Jake Torres', time: '15 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1db10218f-1772446279214.png', alt: 'Perfectly seared air fryer steak with herb butter on a cast iron plate', slug: 'air-fryer-steak' },
    { title: 'Air Fryer Chicken Breast', creator: 'Sofia Patel', time: '18 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1699921b3-1768560136464.png", alt: 'Juicy air fryer chicken breast with seasoning and herbs', slug: 'air-fryer-chicken-breast' },
    { title: 'Air Fryer Mozzarella Sticks', creator: 'Jake Torres', time: '12 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1554561343-a8d5032dbad7", alt: 'Crispy golden air fryer mozzarella sticks with marinara dipping sauce', slug: 'air-fryer-mozzarella-sticks' },
    { title: 'Air Fryer Shrimp', creator: 'Maria Chen', time: '10 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1f19f6fbe-1775504653966.png', alt: 'Perfectly cooked air fryer shrimp with garlic butter and lemon', slug: 'air-fryer-shrimp' },
    { title: 'Air Fryer Egg Rolls', creator: 'Lin Wei', time: '15 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c5d72e5c-1772215051335.png", alt: 'Crispy air fryer egg rolls with vegetable filling and sweet chili sauce', slug: 'air-fryer-egg-rolls' },
    { title: 'Air Fryer Pork Chops', creator: 'Carlos Mendez', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1614231558486-b5bc24dd2d84', alt: 'Juicy air fryer pork chops with garlic herb seasoning and crispy exterior', slug: 'air-fryer-pork-chops' },
    { title: 'Air Fryer Brussels Sprouts', creator: 'Priya Nair', time: '15 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1454719408934-5f2a61e98713", alt: 'Crispy air fryer Brussels sprouts with balsamic glaze and parmesan', slug: 'air-fryer-brussels-sprouts' },
    { title: 'Air Fryer Pizza', creator: 'Marco Rossi', time: '10 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1703784022146-b72677752ce5', alt: 'Quick air fryer personal pizza with crispy crust and melted cheese', slug: 'air-fryer-pizza' },
    { title: 'Air Fryer Banana Chips', creator: 'Aisha Sharma', time: '15 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1623783398179-078261d586d3', alt: 'Crispy homemade air fryer banana chips with cinnamon sugar coating', slug: 'air-fryer-banana-chips' },
    { title: 'Air Fryer Tofu', creator: 'Lin Wei', time: '20 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1585034888529-0898b2145847', alt: 'Crispy air fryer tofu cubes with sesame glaze and green onions', slug: 'air-fryer-tofu' },
    { title: 'Air Fryer Cookies', creator: 'Emma Walsh', time: '12 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1739b9aae-1785345968342.png", alt: 'Soft and chewy chocolate chip cookies made in the air fryer', slug: 'air-fryer-cookies' }]

  },
  baking: {
    title: 'Baking & Desserts',
    label: 'Sweet treats',
    subtitle: 'From everyday bakes to showstoppers',
    recipes: [
    { title: 'Sourdough Bread', creator: 'Emma Walsh', time: '24 hrs', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1658695985093-86cccecf81a5', alt: 'Rustic sourdough loaf with scored crust cooling on a wire rack', slug: 'sourdough-bread' },
    { title: 'Chocolate Lava Cake', creator: 'Sofia Romano', time: '25 min', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_19e43404e-1773176612518.png', alt: 'Warm chocolate lava cake with molten center and powdered sugar dusting', slug: 'chocolate-lava-cake' },
    { title: 'Banana Bread', creator: 'Priya Nair', time: '1 hr', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_12da978a7-1778500554885.png', alt: 'Moist golden banana bread loaf with walnuts on a cutting board', slug: 'banana-bread' },
    { title: 'Cinnamon Rolls', creator: 'Emma Walsh', time: '2 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1aecd958f-1772207180241.png', alt: 'Freshly baked cinnamon rolls with cream cheese frosting in a baking pan', slug: 'cinnamon-rolls' },
    { title: 'Blueberry Muffins', creator: 'Aisha Sharma', time: '35 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1697961533176-53cbe07cbf4e", alt: 'Golden blueberry muffins with sugar crumble topping in a muffin tin', slug: 'blueberry-muffins' },
    { title: 'Cheesecake', creator: 'Sofia Patel', time: '4 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1e366641f-1772871592638.png', alt: 'Creamy New York style cheesecake with graham cracker crust and berry topping', slug: 'cheesecake' },
    { title: 'Apple Pie from Scratch', creator: 'Emma Walsh', time: '2.5 hrs', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1638329261528-1932b0e63212', alt: 'Golden homemade apple pie with lattice crust cooling on a wooden table', slug: 'apple-pie-scratch' },
    { title: 'Chocolate Chip Cookies', creator: 'Priya Nair', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1626079451331-255826fd3581", alt: 'Thick and chewy chocolate chip cookies fresh from the oven on a baking sheet', slug: 'chocolate-chip-cookies' },
    { title: 'Tiramisu', creator: 'Sofia Romano', time: '4 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d7fa7325-1772072802998.png", alt: 'Classic Italian tiramisu with mascarpone cream and cocoa dusting', slug: 'tiramisu' },
    { title: 'Croissants', creator: 'Emma Walsh', time: '12 hrs', difficulty: 'Hard', image: "https://images.unsplash.com/photo-1573119451355-8b5d21861dc5", alt: 'Flaky golden homemade croissants with buttery layers on a baking sheet', slug: 'croissants' },
    { title: 'Lemon Tart', creator: 'Sofia Romano', time: '2 hrs', difficulty: 'Medium', image: "https://img.rocket.new/generatedImages/rocket_gen_img_12231700d-1772181132619.png", alt: 'Bright and tangy lemon tart with silky curd and buttery pastry shell', slug: 'lemon-tart' },
    { title: 'Brownies', creator: 'Jake Torres', time: '45 min', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1606312618872-929717f93c21', alt: 'Fudgy chocolate brownies with crinkly top and gooey center', slug: 'brownies' },
    { title: 'Carrot Cake', creator: 'Aisha Sharma', time: '1.5 hrs', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1664192578376-08a18baa787d", alt: 'Moist carrot cake with cream cheese frosting and walnut decoration', slug: 'carrot-cake' },
    { title: 'Macarons', creator: 'Sofia Romano', time: '3 hrs', difficulty: 'Hard', image: 'https://images.unsplash.com/photo-1558303420-f814d8a590f5', alt: 'Colorful French macarons with buttercream filling on a marble surface', slug: 'macarons' },
    { title: 'Panna Cotta', creator: 'Marco Rossi', time: '3 hrs', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_139f74b37-1779366233060.png", alt: 'Silky vanilla panna cotta with fresh berry coulis and mint garnish', slug: 'panna-cotta' },
    { title: 'Scones', creator: 'Emma Walsh', time: '30 min', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1644774470220-1731d53c3976", alt: 'Flaky golden scones with clotted cream and strawberry jam', slug: 'scones' }]

  },
  family: {
    title: 'Family Recipes',
    subtitle: 'Recipes worth passing down',
    recipes: [
    { title: 'Sunday Pot Roast', creator: 'Marco Rossi', time: '3 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_118501734-1771898937177.png', alt: 'Slow-cooked pot roast with root vegetables in a Dutch oven', slug: 'sunday-pot-roast' },
    { title: "Grandma's Chicken Soup", creator: 'Rosa Gutierrez', time: '1.5 hrs', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1727417376054-a3a6d6f31999', alt: 'Hearty homemade chicken noodle soup with vegetables in a white bowl', slug: 'grandmas-chicken-soup' },
    { title: 'Classic Lasagna', creator: 'Maria Chen', time: '2 hrs', difficulty: 'Medium', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_18ea24141-1772646976917.png', alt: 'Layered classic lasagna with meat sauce and bubbling mozzarella cheese', slug: 'classic-lasagna' },
    { title: 'Apple Pie from Scratch', creator: 'Emma Walsh', time: '2.5 hrs', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1638329261528-1932b0e63212', alt: 'Golden homemade apple pie with lattice crust cooling on a wooden table', slug: 'apple-pie-scratch' },
    { title: 'Beef Stew', creator: 'Jake Torres', time: '2 hrs', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1517847043-aa5de082df8a', alt: 'Rich beef stew with carrots, potatoes, and herbs in a deep pot', slug: 'beef-stew' },
    { title: 'Roast Chicken', creator: 'Sofia Romano', time: '1.5 hrs', difficulty: 'Easy', image: 'https://images.unsplash.com/photo-1602534923950-d2c7e6be0ca0', alt: 'Golden roast chicken with crispy skin and herbs on a roasting pan', slug: 'roast-chicken' },
    { title: 'Meatloaf', creator: 'Jake Torres', time: '1.5 hrs', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_172f977d6-1784072834165.png", alt: 'Classic meatloaf with ketchup glaze and mashed potatoes on the side', slug: 'meatloaf' },
    { title: 'Macaroni & Cheese', creator: 'Emma Walsh', time: '45 min', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1beb1562f-1772222748789.png', alt: 'Creamy homemade macaroni and cheese with golden breadcrumb topping', slug: 'macaroni-cheese' },
    { title: 'Shepherd\'s Pie', creator: 'Marco Rossi', time: '1.5 hrs', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1517847043-aa5de082df8a', alt: 'Traditional shepherd\'s pie with lamb filling and creamy mashed potato topping', slug: 'shepherds-pie' },
    { title: 'Fried Chicken', creator: 'Carlos Mendez', time: '1 hr', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1712536465274-6b2e55c4a170", alt: 'Crispy Southern fried chicken with golden crust and juicy interior', slug: 'fried-chicken' },
    { title: 'Spaghetti & Meatballs', creator: 'Marco Rossi', time: '1.5 hrs', difficulty: 'Medium', image: 'https://images.unsplash.com/photo-1634838512151-0773b35c91ee', alt: 'Classic spaghetti and meatballs with rich tomato sauce and parmesan', slug: 'spaghetti-meatballs' },
    { title: 'Chili con Carne', creator: 'Jake Torres', time: '1.5 hrs', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1664339031004-9cfdf88b8017", alt: 'Hearty chili con carne with kidney beans, beef, and spices in a bowl', slug: 'chili-con-carne' },
    { title: 'Banana Bread', creator: 'Priya Nair', time: '1 hr', difficulty: 'Easy', image: 'https://img.rocket.new/generatedImages/rocket_gen_img_12da978a7-1778500554885.png', alt: 'Moist golden banana bread loaf with walnuts on a cutting board', slug: 'banana-bread' },
    { title: 'Chicken Casserole', creator: 'Rosa Gutierrez', time: '1.5 hrs', difficulty: 'Easy', image: "https://images.unsplash.com/photo-1712568828269-05b90da8e7d5", alt: 'Comforting chicken casserole with vegetables and creamy sauce', slug: 'chicken-casserole' },
    { title: 'Stuffed Cabbage Rolls', creator: 'Sofia Romano', time: '2 hrs', difficulty: 'Medium', image: "https://images.unsplash.com/photo-1556741601-487d577bc244", alt: 'Tender cabbage rolls stuffed with seasoned meat and rice in tomato sauce', slug: 'stuffed-cabbage-rolls' },
    { title: 'Cornbread', creator: 'Carlos Mendez', time: '35 min', difficulty: 'Easy', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c2fdd15f-1772633388557.png", alt: 'Golden skillet cornbread with crispy edges and tender crumb', slug: 'cornbread' }]

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