import { useState, useEffect } from 'react';
import { MenuItem } from '../types/menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Clock, Leaf, AlertCircle, Plus, Minus, ShoppingCart } from 'lucide-react';

interface DishDetailsDialogProps {
  dish: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart?: (item: MenuItem, quantity: number) => void;
  cartQuantity?: number;
}

export function DishDetailsDialog({ dish, open, onOpenChange, onAddToCart, cartQuantity = 0 }: DishDetailsDialogProps) {
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when dialog opens or dish changes
  useEffect(() => {
    if (open && dish) {
      setQuantity(1);
    }
  }, [open, dish]);

  if (!dish) return null;

  const handleAddToCart = () => {
    if (onAddToCart && quantity > 0) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(dish, 1);
      }
      
      // Automatically close the dialog after adding to cart
      setQuantity(1);
      onOpenChange(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-[#FFF9F0] border-2 border-[#C4941D]/30">
        <DialogHeader>
          <DialogTitle className="text-[#3E2723] text-2xl">{dish.name}</DialogTitle>
          <DialogDescription className="text-[#8B7355]">
            Detailed nutritional information and ingredients
          </DialogDescription>
        </DialogHeader>

        {/* Dish Image */}
        <div className="w-full aspect-video rounded-xl overflow-hidden border-2 border-[#C4941D]/20">
          <ImageWithFallback
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description & Badges */}
        <div className="space-y-3">
          <p className="text-[#3E2723]">{dish.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {dish.popular && (
              <Badge className="bg-[#C4941D] text-white">
                ⭐ Popular
              </Badge>
            )}
            {dish.vegetarian && (
              <Badge className="bg-[#6B8E23] text-white">
                <Leaf className="w-3 h-3 mr-1" />
                Vegetarian
              </Badge>
            )}
            {dish.prepTime && (
              <Badge variant="outline" className="border-[#C4941D]/30 text-[#8B7355]">
                <Clock className="w-3 h-3 mr-1" />
                {dish.prepTime}
              </Badge>
            )}
          </div>
        </div>

        <Separator className="bg-[#C4941D]/20" />

        {/* Nutritional Information */}
        {dish.nutritionalInfo && (
          <div className="space-y-3">
            <h3 className="text-[#3E2723] text-lg flex items-center gap-2">
              📊 Nutritional Facts
            </h3>
            
            <div className="bg-white rounded-xl p-4 border border-[#C4941D]/20">
              <div className="text-xs text-[#8B7355] mb-3">
                Serving Size: {dish.nutritionalInfo.servingSize}
              </div>
              
              <div className="space-y-2">
                {/* Calories - Highlighted */}
                <div className="flex justify-between items-center bg-[#FFF4E0] rounded-lg px-3 py-2 border border-[#C4941D]/30">
                  <span className="text-[#3E2723]">Calories</span>
                  <span className="text-[#C4941D]">{dish.nutritionalInfo.calories} kcal</span>
                </div>
                
                <Separator className="bg-[#C4941D]/10" />
                
                {/* Other Nutrients */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B7355]">Protein</span>
                    <span className="text-[#3E2723]">{dish.nutritionalInfo.protein}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B7355]">Carbohydrates</span>
                    <span className="text-[#3E2723]">{dish.nutritionalInfo.carbs}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B7355]">Fat</span>
                    <span className="text-[#3E2723]">{dish.nutritionalInfo.fat}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B7355]">Fiber</span>
                    <span className="text-[#3E2723]">{dish.nutritionalInfo.fiber}g</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8B7355]">Sodium</span>
                    <span className="text-[#3E2723]">{dish.nutritionalInfo.sodium}mg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ingredients */}
        {dish.ingredients && dish.ingredients.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[#3E2723] text-lg flex items-center gap-2">
              🥘 Ingredients
            </h3>
            <div className="flex flex-wrap gap-2">
              {dish.ingredients.map((ingredient, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-[#C4941D]/30 text-[#8B7355] bg-white"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Allergens */}
        {dish.allergens && dish.allergens.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-[#3E2723] text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Allergen Information
            </h3>
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <div className="flex flex-wrap gap-2">
                {dish.allergens.map((allergen, index) => (
                  <Badge
                    key={index}
                    className="bg-red-600 text-white"
                  >
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        <Separator className="bg-[#C4941D]/20" />

        {/* Price & Add to Cart Section */}
        <div className="space-y-4 sticky bottom-0 bg-[#FFF9F0] pt-4 -mb-2">
          {/* Price Display */}
          <div className="bg-white rounded-xl p-4 border-2 border-[#C4941D]/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[#8B7355]">Price per item</span>
              <span className="text-2xl text-[#C4941D]">
                €{dish.price.toFixed(2)}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-[#FFF4E0] rounded-lg p-3">
              <span className="text-[#3E2723]">Quantity</span>
              <div className="flex items-center gap-3">
                <Button
                  onClick={decrementQuantity}
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 rounded-full border-[#C4941D]/30 hover:bg-[#C4941D] hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-12 text-center text-[#3E2723] text-lg">
                  {quantity}
                </div>
                <Button
                  onClick={incrementQuantity}
                  size="icon"
                  variant="outline"
                  className="w-8 h-8 rounded-full border-[#C4941D]/30 hover:bg-[#C4941D] hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            {quantity > 1 && (
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#C4941D]/20">
                <span className="text-[#8B7355] text-sm">Total for {quantity} items</span>
                <span className="text-xl text-[#C4941D]">
                  €{(dish.price * quantity).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Already in Cart Notice */}
          {cartQuantity > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-700">
                📦 Already in cart: {cartQuantity} item{cartQuantity > 1 ? 's' : ''}
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          {onAddToCart && (
            <Button
              onClick={handleAddToCart}
              className="w-full h-12 bg-[#C4941D] hover:bg-[#B38818] text-white rounded-xl shadow-lg"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add {quantity} to Cart · €{(dish.price * quantity).toFixed(2)}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
