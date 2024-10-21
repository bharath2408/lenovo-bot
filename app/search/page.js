"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const lenovoProducts = [
  {
    id: 1,
    name: "Lenovo ThinkPad X1 Carbon",
    description:
      "Ultra-light business laptop with 14-inch display and long battery life.",
    price: 1499.99,
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200&text=ThinkPad X1 Carbon",
  },
  {
    id: 2,
    name: "Lenovo Yoga 9i",
    description:
      "2-in-1 convertible laptop with 14-inch touchscreen and Intel Core i7 processor.",
    price: 1399.99,
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200&text=Yoga 9i",
  },
  {
    id: 3,
    name: "Lenovo Legion 5 Pro",
    description:
      "Powerful gaming laptop with 16-inch QHD display and NVIDIA GeForce RTX graphics.",
    price: 1699.99,
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200&text=Legion 5 Pro",
  },
  {
    id: 4,
    name: "Lenovo IdeaPad 5",
    description:
      "Affordable 15.6-inch laptop with AMD Ryzen processor and solid performance.",
    price: 699.99,
    rating: 4.4,
    image: "/placeholder.svg?height=200&width=200&text=IdeaPad 5",
  },
  {
    id: 5,
    name: "Lenovo ThinkBook 14s Yoga",
    description:
      "Versatile business 2-in-1 laptop with 14-inch display and built-in stylus.",
    price: 999.99,
    rating: 4.5,
    image: "/placeholder.svg?height=200&width=200&text=ThinkBook 14s Yoga",
  },
  {
    id: 6,
    name: "Lenovo ThinkCentre M720 Tiny",
    description:
      "Compact desktop PC for business with Intel Core i5 and multiple connectivity options.",
    price: 649.99,
    rating: 4.3,
    image: "/placeholder.svg?height=200&width=200&text=ThinkCentre M720 Tiny",
  },
];

export default function LenovoProductSearch() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Input
          type="search"
          placeholder="Search Lenovo products..."
          className="w-full md:w-96"
        />
        <Select defaultValue="relevance">
          <option value="relevance">Relevance</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </Select>
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div> */}

      <div className="flex flex-col md:flex-row gap-8">
        <aside
          className={`w-full md:w-64 ${
            showFilters ? "block" : "hidden md:block"
          }`}
        >
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <div className="space-y-2">
                <label className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center">
                  {/* <Checkbox id="category-laptops" /> */}
                  <span className="ml-2">Result 1</span>
                </label>
                <label className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center">
                  {/* <Checkbox id="category-desktops" /> */}
                  <span className="ml-2">Result 2</span>
                </label>
                <label className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center">
                  {/* <Checkbox id="category-tablets" /> */}
                  <span className="ml-2">Result 3</span>
                </label>
                <label className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center">
                  {/* <Checkbox id="category-tablets" /> */}
                  <span className="ml-2">Result 4</span>
                </label>
                <label className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 flex items-center">
                  {/* <Checkbox id="category-tablets" /> */}
                  <span className="ml-2">Result 5</span>
                </label>
              </div>
            </div>
            {/* <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Checkbox id="price-0-500" />
                  <span className="ml-2">$0 - $500</span>
                </label>
                <label className="flex items-center">
                  <Checkbox id="price-500-1000" />
                  <span className="ml-2">$500 - $1000</span>
                </label>
                <label className="flex items-center">
                  <Checkbox id="price-1000-plus" />
                  <span className="ml-2">$1000+</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Rating</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Checkbox id="rating-4-plus" />
                  <span className="ml-2">4+ Stars</span>
                </label>
                <label className="flex items-center">
                  <Checkbox id="rating-3-plus" />
                  <span className="ml-2">3+ Stars</span>
                </label>
              </div>
            </div>*/}
          </div>
        </aside>

        <main className="flex-1">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {lenovoProducts.map((product, index) => (
              <motion.div
                key={index}
                className="overflow-hidden"
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ scale: 1.03 }}
              >
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover mb-4 rounded"
                    />
                    <h3 className="font-semibold text-lg mb-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">
                        ${product.price.toFixed(2)}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">
                          {"★".repeat(Math.round(product.rating))}
                        </span>
                        <span className="text-sm text-gray-600 ml-1">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
