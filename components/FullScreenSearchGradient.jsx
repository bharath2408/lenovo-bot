"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import React, { useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// const searchTechniques = [
//   {
//     name: "Result 1",
//     description: "Search Lenovo products by specific keywords",
//     products: [
//       {
//         name: "Lenovo ThinkPad X1 Carbon",
//         itemNumber: "TP001",
//         description: "Ultra-lightweight laptop for business professionals",
//       },
//       {
//         name: "Lenovo Legion 5 Gaming Laptop",
//         itemNumber: "LG002",
//         description: "High-performance gaming laptop with powerful graphics",
//       },
//       {
//         name: "Lenovo IdeaPad Flex 5",
//         itemNumber: "IF003",
//         description: "Versatile 2-in-1 laptop for work and entertainment",
//       },
//       {
//         name: "Lenovo Tab M10 Plus",
//         itemNumber: "TM004",
//         description: "Slim and portable tablet for everyday use",
//       },
//       {
//         name: "Lenovo Yoga Smart Tab",
//         itemNumber: "YT005",
//         description: "Smart tablet with built-in Google Assistant",
//       },
//     ],
//   },
//   {
//     name: "Result 2",
//     description: "Browse Lenovo products by category",
//     products: [
//       {
//         name: "Lenovo ThinkCentre Desktop",
//         itemNumber: "TC006",
//         description: "Reliable desktop solution for businesses",
//       },
//       {
//         name: "Lenovo Legion Tower 5i",
//         itemNumber: "LT007",
//         description: "Powerful gaming desktop for immersive gameplay",
//       },
//       {
//         name: "Lenovo IdeaCentre AIO 3",
//         itemNumber: "IA008",
//         description: "All-in-one desktop for home or office",
//       },
//       {
//         name: "Lenovo ThinkVision Monitor",
//         itemNumber: "TV009",
//         description: "High-resolution monitor for clear visuals",
//       },
//       {
//         name: "Lenovo USB-C Docking Station",
//         itemNumber: "DS010",
//         description: "Expand your connectivity with a versatile dock",
//       },
//     ],
//   },
//   {
//     name: "Result 3",
//     description: "Find products from Lenovo's specific brands",
//     products: [
//       {
//         name: "Lenovo ThinkPad T Series",
//         itemNumber: "TT011",
//         description: "Trusted business laptops with robust performance",
//       },
//       {
//         name: "Lenovo Legion Y740",
//         itemNumber: "LY012",
//         description: "Premium gaming laptop with advanced cooling",
//       },
//       {
//         name: "Lenovo IdeaPad S340",
//         itemNumber: "IS013",
//         description: "Slim and stylish laptop for everyday tasks",
//       },
//       {
//         name: "Lenovo ThinkBook 15",
//         itemNumber: "TB014",
//         description: "Modern laptop designed for small businesses",
//       },
//       {
//         name: "Lenovo Yoga C940",
//         itemNumber: "YC015",
//         description: "Convertible laptop with 4K display and stylus support",
//       },
//     ],
//   },
//   {
//     name: "Result 4",
//     description: "Search Lenovo products within a specific price range",
//     products: [
//       {
//         name: "Lenovo Chromebook Duet",
//         itemNumber: "CD016",
//         description: "Affordable 2-in-1 Chromebook for students",
//       },
//       {
//         name: "Lenovo IdeaPad 3",
//         itemNumber: "IP017",
//         description: "Budget-friendly laptop for everyday use",
//       },
//       {
//         name: "Lenovo ThinkPad P Series",
//         itemNumber: "TP018",
//         description: "Premium mobile workstation for professionals",
//       },
//       {
//         name: "Lenovo Yoga Slim 7",
//         itemNumber: "YS019",
//         description: "Mid-range laptop with sleek design and performance",
//       },
//       {
//         name: "Lenovo ThinkStation P340",
//         itemNumber: "TS020",
//         description: "High-end workstation for demanding tasks",
//       },
//     ],
//   },
//   {
//     name: "Result 5",
//     description: "Find Lenovo products by specific colors",
//     products: [
//       {
//         name: "Lenovo ThinkPad X1 Yoga (Black)",
//         itemNumber: "XY021",
//         description: "Convertible laptop with iconic black finish",
//       },
//       {
//         name: "Lenovo Yoga 9i (Mica)",
//         itemNumber: "Y922",
//         description: "Stylish 2-in-1 laptop with a premium Mica finish",
//       },
//       {
//         name: "Lenovo IdeaPad 5 (Platinum Grey)",
//         itemNumber: "IP023",
//         description: "Modern laptop in a sleek Platinum Grey color",
//       },
//       {
//         name: "Lenovo Legion 7 (Phantom Blue)",
//         itemNumber: "L724",
//         description: "High-performance gaming laptop in Phantom Blue",
//       },
//       {
//         name: "Lenovo Yoga Duet 7i (Orchid Pink)",
//         itemNumber: "YD025",
//         description: "2-in-1 detachable laptop in Orchid Pink",
//       },
//     ],
//   },
// ];

export default function FullScreenSearchGradient() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const searchInputRef = useRef(null);
  const [searchTechniques, setSearchTechniques] = useState();
  const [loading, setLoading] = useState(false);

  const searchLaptops = async (searchQuery) => {
    const url =
      "https://pa9dxf1379.execute-api.us-east-1.amazonaws.com/essearch/essearch";
    const payload = {
      search_query: searchQuery,
    };

    setLoading(true);

    try {
      const response = await axios.post(url, payload);
      console.log(JSON.parse(response.data.body));
      setSearchTechniques(JSON.parse(response.data.body));
      setLoading(false);
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error making the API call:", error);
      throw error;
    } finally {
      setLoading(false); // Set loading to false once the API call is complete
    }
  };

  const searchSolor = async (searchQuery) => {
    const url = `https://solr-fastapi-arbca6aqc2dqh9g4.eastus-01.azurewebsites.net/solr-hybridsearch/${searchQuery}`;

    setLoading(true);

    try {
      const response = await axios.get(url);
      setSearchTechniques((prev) => ({
        ...prev,
        solr_hybrid: response?.data?.slice(0, 5),
      }));
      setLoading(false);
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error making the API call:", error);
      throw error;
    } finally {
      setLoading(false); // Set loading to false once the API call is complete
    }
  };

  // const filteredTechniques = searchTechniques.filter(
  //   (technique) =>
  //     technique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     technique.products.some(
  //       (product) =>
  //         product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         product.itemNumber.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  // );

  const openSearch = () => {
    // setIsSearchOpen(true);
    // setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm("");
    setSearchTechniques(null);
    setSelectedProduct(null);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  function formatKey(key) {
    return key
      ?.split("_") // Split the string by underscores
      ?.map(
        (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase()
      ) // Capitalize the first letter of each word
      ?.join(" "); // Join the words back with spaces
  }

  const handleSearch = async () => {
    if (searchTerm) {
      await searchLaptops(searchTerm);
      await searchSolor(searchTerm);
    }
  };

  const parseSpecs = (specsString) => {
    console.log(specsString);
    const pairs = specsString?.split(" | ");
    const specs = {};
    pairs?.forEach((pair) => {
      const [key, ...valueParts] = pair?.split(": ");
      const value = valueParts?.join(": "); // Rejoin in case the value itself contains ': '
      specs[key] = value;
    });
    return specs;
  };

  console.log(selectedProduct);

  const laptopSpecs = parseSpecs(
    selectedProduct?.concatenated_text || selectedProduct?.content
  );

  console.log(searchTechniques);

  return (
    <div className="relative w-1/2">
      <header
        className={clsx(" items-center justify-between bg-background ", {
          hidden: isSearchOpen,
          flex: !isSearchOpen,
        })}
      >
        <div className="hidden sm:flex md:flex xl:flex items-center h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full cursor-pointer mx-2 flex-grow shadow-md">
          <input
            disabled={loading}
            ref={searchInputRef}
            className={clsx(
              "p-2 h-full bg-gray-100 flex-grow rounded-l-full focus:outline-none px-4"
            )}
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={openSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchTerm) {
                handleSearch();
              }
            }}
          />
          <div className="p-4" disabled={loading} onClick={handleSearch}>
            <Search className="h-5 w-5 text-white" />
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={openSearch}
          className="sm:hidden"
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Open search</span>
        </Button>
      </header>

      {(loading ||
        isSearchOpen ||
        (searchTechniques && Object.keys(searchTechniques).length > 0)) && (
        <motion.div
          className="rounded-lg shadow-lg shadow-blue-200 max-h-[86%] w-full fixed mt-auto inset-0 z-50 bg-background overflow-y-auto scrollbar-none"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full px-6 py-2">
            {/* Search Bar */}
            <div className="sticky top-0 z-10 p-2 bg-white flex items-center justify-between mb-2">
              {/* <div className="flex items-center h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-sm cursor-pointer mx-2 flex-grow max-w-3xl shadow-md">
                <input
                  ref={searchInputRef}
                  className="py-2 h-full bg-gray-100 flex-grow  focus:outline-none px-4 text-gray-700 placeholder-gray-400"
                  type="text"
                  placeholder="Search techniques or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div onClick={() => searchLaptops(searchTerm)} className="p-3">
                  <Search className="h-6 w-6 text-white" />
                </div>
              </div>
              */}
              Search result for "{searchTerm}"
              <button
                variant="ghost"
                size="icon"
                className="ml-3 p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                onClick={closeSearch}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close search</span>
              </button>
            </div>

            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col items-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                  {/* <p className="text-lg font-semibold text-primary">
                    Loading...
                  </p> */}
                </div>
              </div>
            ) : (
              <motion.div
                className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2"
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
                {searchTechniques &&
                Object.keys(searchTechniques).length > 0 ? (
                  <>
                    {Object?.keys(searchTechniques)?.map((key) => (
                      <motion.div
                        key={key}
                        className="overflow-hidden"
                        variants={{
                          hidden: { opacity: 0, scale: 0.9 },
                          visible: { opacity: 1, scale: 1 },
                        }}
                        whileHover={{ scale: 1.03 }}
                      >
                        <Card className="overflow-hidden bg-white rounded-lg shadow-md transition-shadow">
                          <CardHeader className="py-2 px-6">
                            <CardTitle className="text-lg font-semibold text-gray-800">
                              {formatKey(key)}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {/* <p className="text-sm text-gray-600 mb-4">
                        {technique.description}
                      </p> */}
                            <div className="space-y-2">
                              {searchTechniques?.[key]?.map(
                                (product, productIndex) => (
                                  <motion.div
                                    key={productIndex}
                                    className="p-3 bg-blue-50 rounded-md cursor-pointer hover:bg-blue-100 hover:shadow-md transition-transform transform hover:scale-105"
                                    onClick={() => handleProductClick(product)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                  >
                                    <h3 className="font-medium text-sm text-gray-800 truncate">
                                      {product?.title}
                                    </h3>
                                    <p className="flex items-center justify-between uppercase text-sm text-gray-500">
                                      {product?.part_number}
                                      <span className="capitalize font-semibold">
                                        Rank:{" "}
                                        {product?.rank || productIndex + 1}
                                      </span>
                                    </p>
                                  </motion.div>
                                )
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </>
                ) : null}
              </motion.div>
            )}

            {/* Cards Grid */}
          </div>
        </motion.div>
      )}

      {selectedProduct && (
        <Dialog
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedProduct?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Item Number:{" "}
                <span className="uppercase">
                  {selectedProduct?.part_number}
                </span>
              </p>
              <p>{selectedProduct.description}</p>
            </div>
            <div className="container mx-auto py-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-1/3">Specification</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(laptopSpecs).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell className="font-medium capitalize">
                            {formatKey(key)}
                          </TableCell>
                          <TableCell>
                            {key === "operating system" ? (
                              <div
                                dangerouslySetInnerHTML={{ __html: value }}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
