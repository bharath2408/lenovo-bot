"use client";
import ChatbotBubble from "@/components/ChatbotBubble";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { data } from "@/lib/data";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import axios from "axios";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowUp,
  BotMessageSquare,
  CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  CircleAlert,
  Ellipsis,
  Expand,
  ExternalLink,
  Heart,
  Info,
  MapPinIcon,
  Maximize2,
  MessageCircle,
  Minimize2,
  MinusCircle,
  Send,
  ShoppingCart,
  Shrink,
  Sparkles,
  Star,
  Tag,
  TruckIcon,
  X,
  XCircle,
} from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";

const predefinedQuestions = [
  "What are the available sizes?",
  "Is this item currently in stock?",
  "What is the estimated delivery time?",
  "What is the estimated delivery time?",
  "What is the estimated delivery time?",
];

// const images = [
//   "https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/1655a59c-3609-440a-9465-eb13cb9a8bb3?quality=60&_mzcb=_1703879152693",
//   "https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/47430b4e-1624-40a0-9925-fe3d06f6ad4d?quality=60&_mzcb=_1703879152693",
//   "https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/b59cc7f7-29c3-4f94-b891-a5821e52603a?quality=60&_mzcb=_1703879152693",
//   "https://cdn-tp3.mozu.com/24645-37138/cms/37138/files/7a3df487-5a3d-430b-aa96-629acf699935?quality=60&_mzcb=_1703879152693",
// ];

export default function Component({ params }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [botExpand, setBotExpand] = useState(false);
  const [expandedItems, setExpandedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [question1Answer, setQuestion1Answer] = useState("");
  const [question2Answer, setQuestion2Answer] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Welcome to our customer service chat. How may I assist you today?",
      isBot: true,
      id: 1,
    },
  ]);
  const [buttons, setButtons] = useState([]);

  const getProductdetails = () => {
    return data?.filter((item) => item?.item_number == params?.slug);
  };

  const productDetails = getProductdetails();

  const [currentImage, setCurrentImage] = useState(
    productDetails?.[0]?.images_url?.[0]
  );
  const [sliderIndex, setSliderIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleImageClick = (image, index) => {
    setCurrentImage(image);
    setSliderIndex(index);
  };

  const handlePrevious = () => {
    setSliderIndex((prevIndex) => {
      const newIndex =
        prevIndex > 0
          ? prevIndex - 1
          : productDetails?.[0]?.images_url?.length - 1;
      setCurrentImage(productDetails?.[0]?.images_url[newIndex]);
      return newIndex;
    });
  };

  const handleNext = () => {
    setSliderIndex((prevIndex) => {
      const newIndex =
        prevIndex < productDetails?.[0]?.images_url?.length - 1
          ? prevIndex + 1
          : 0;
      setCurrentImage(productDetails?.[0]?.images_url[newIndex]);
      return newIndex;
    });
  };
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      // Scroll the chat container to the bottom
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  };

  const handleSendMessage = async (id, question) => {
    // if (question.trim() === "") return;

    const newUserMessage = {
      text: question,
      isBot: false,
      id: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText("");
    setIsTyping(true);
    // scrollToBottom();

    setLoading(true);
    try {
      // Make the POST request using axios
      const response = await axios.post(
        "https://langgraph.azurewebsites.net/chatbot",
        {
          part_number: { current_product: params?.slug },
          messages: params?.slug,
        }
      );

      if (response.status === 200) {
        const parsedResponse = JSON.parse(response.data);

        let result;

        result = parsedResponse;

        // Step 4: Extract the FAQs
        const faqs = result?.faqs?.faqs || [];
        // Set the button data from the response
        // Assuming the API returns `faqs` in the response data

        const filteredQuestions = faqs?.filter(
          (q) => q.questions.toLowerCase() === question.toLowerCase()
        )?.[0]?.answers;

        if (filteredQuestions) {
          let index = 0;
          const typingInterval = setInterval(() => {
            if (index < filteredQuestions?.length) {
              setLoading(false);
              const currentChar = filteredQuestions.charAt(index);
              setCurrentTypingText((prev) => {
                const updatedText = prev + currentChar;

                return updatedText;
              });

              index++;
            } else {
              setLoading(false);
              clearInterval(typingInterval);
              setIsTyping(false);
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  text: filteredQuestions,
                  isBot: true,
                  id: Date.now(),
                },
              ]);

              setCurrentTypingText("");
            }
          }, 40);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setIsTyping(false);
    }
  };

  const handleTypeMessage = async (usertext) => {
    const newUserMessage = {
      text: usertext,
      isBot: false,
      id: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputText("");
    setIsTyping(true);
    // scrollToBottom();

    setLoading(true);
    try {
      // Make the POST request using axios
      const response = await axios.post(
        "https://langgraph.azurewebsites.net/chatbot",
        {
          part_number: { current_product: params?.slug },
          messages: usertext,
        }
      );

      if (response.status === 200) {
        const parsedResponse = JSON.parse(response.data);

        console.log(parsedResponse);

        if (parsedResponse.status === "error") {
          let outputString = parsedResponse;

          // Step 2: Replace single quotes with double quotes to make it valid JSON
          if (outputString) {
            let index = 0;
            const typingInterval = setInterval(() => {
              if (index < outputString?.length) {
                setLoading(false);
                const currentChar = outputString?.charAt(index);
                setCurrentTypingText((prev) => {
                  const updatedText = prev + currentChar;
                  return updatedText;
                });

                index++;
              } else {
                setLoading(false);
                clearInterval(typingInterval);
                setIsTyping(false);
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    text: outputString,
                    isBot: true,
                    id: Date.now(),
                  },
                ]);

                setCurrentTypingText("");
              }
            }, 40);
          }
        } else {
          let outputString = parsedResponse;

          // Step 2: Replace single quotes with double quotes to make it valid JSON

          let result;

          result = outputString;

          if (
            result?.questions ||
            result?.suggestion ||
            result?.other ||
            result?.comparison
          ) {
            let index = 0;
            const typingInterval = setInterval(() => {
              if (
                index < result?.questions?.length ||
                index < result?.other?.length
              ) {
                setLoading(false);
                const currentChar =
                  result?.questions?.charAt(index) ||
                  result?.other?.charAt(index);
                setCurrentTypingText((prev) => {
                  const updatedText = prev + currentChar;
                  return updatedText;
                });

                index++;
              } else {
                setLoading(false);
                clearInterval(typingInterval);
                setIsTyping(false);
                const itemNumbers =
                  result?.comparison?.item_number_match?.map(
                    (item) => item.item_number
                  ) || [];
                setSelectedItems(itemNumbers);
                const uniqueProducts =
                  result?.comparison?.product_name_match?.flatMap((match) => {
                    return Object.entries(match).map(([key, value]) => ({
                      key,
                      value,
                    }));
                  }) || [];
                const uniqueProductList = uniqueProducts.filter(
                  (product, index, self) =>
                    index === self.findIndex((p) => p.key === product.key)
                );
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    text: result?.questions || result?.other || "",
                    suggestion: result?.suggestion || [],
                    compareInputValue: {
                      item_number_match:
                        result?.comparison?.item_number_match || [],
                      product_suggest: [uniqueProductList] || [],
                      product_label:
                        result?.comparison?.product_name_match?.flatMap(
                          (match) => Object.keys(match).flat()
                        ) || [],
                    },
                    isBot: true,
                    id: Date.now(),
                  },
                ]);

                setCurrentTypingText("");
              }
            }, 40);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    // Only scroll to bottom when a new message is added
    if (messages.length > 1) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [messages, isTyping]);

  const shippingInfo = {
    date: "2023-09-28",
    location: "New York, NY 10001",
    status: "In Transit",
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    setQuantity(isNaN(newQuantity) ? 1 : Math.max(1, newQuantity));
  };

  useEffect(() => {
    const fetchStream = async () => {
      try {
        // Make the POST request using axios
        const response = await axios.post(
          "https://langgraph.azurewebsites.net/chatbot",
          {
            part_number: { current_product: params?.slug },
            messages: params?.slug,
          }
        );

        if (response.status === 200) {
          let parsedResponse = JSON.parse(response.data);

          console.log(parsedResponse);

          // Step 2: Replace single quotes with double quotes to make it valid JSON
          // parsedResponse = parsedResponse.replace(/'/g, '"');

          // parsedResponse = parsedResponse.replace(/HumanMessage\(.*?\)/g, "");

          // parsedResponse = parsedResponse.replace(/\"s/g, "'s");

          // Step 4: Extract the FAQs
          const faqs = parsedResponse?.faqs?.faqs || [];
          // Set the button data from the response
          setButtons(faqs); // Assuming the API returns `faqs` in the response data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStream();
  }, [params?.slug]);

  const fetchComapare = async (selectedItemsString) => {
    try {
      setIsTyping(true);
      setLoading(true);
      // Make the POST request using axios
      const response = await axios.post(
        "https://langgraph.azurewebsites.net/chatbot",
        {
          part_number: { current_product: params?.slug },
          messages: "compare " + selectedItemsString,
        }
      );

      if (response.status === 200) {
        let parsedResponse = JSON.parse(response.data);

        const typingInterval = setInterval(() => {
          setLoading(false);
          clearInterval(typingInterval);
          setIsTyping(false);
          setBotExpand(true);
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              compare: parsedResponse?.comparison?.compare_data,
              isBot: true,
              id: Date.now(),
            },
          ]);
        }, 40);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   // Initialize the chatbot loader after the page has loaded
  //   const loaderOpts = {
  //     baseUrl: "https://d3p1ej7da3m9bg.cloudfront.net",
  //     shouldLoadMinDeps: true,
  //   };

  //   // Ensure ChatBotUiLoader is available in the global scope
  //   if (window.ChatBotUiLoader) {
  //     const loader = new window.ChatBotUiLoader.IframeLoader(loaderOpts);

  //     loader.load(loader).catch((error) => {
  //       console.error("Chatbot loading error:", error);
  //     });
  //   } else {
  //     console.error("ChatBotUiLoader is not available.");
  //   }
  // }, []);

  const formatKey = (key) => {
    return key
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  };

  if (!productDetails) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxChange = (itemNumber) => {
    setSelectedItems((prevSelectedItems) => {
      // Check if the item is already selected
      if (prevSelectedItems.includes(itemNumber)) {
        // If it's selected, remove it from the selected items list
        return prevSelectedItems.filter((item) => item !== itemNumber);
      } else {
        // If it's not selected, add it to the selected items list
        return [...prevSelectedItems, itemNumber];
      }
    });
  };

  const renderValue = (value) => {
    if (value?.toLowerCase() === "yes") {
      return <CheckCircle2 className="text-green-500" />;
    } else if (value?.toLowerCase() === "no") {
      return <XCircle className="text-red-500" />;
    } else if (value?.toLowerCase() === "not available") {
      return <MinusCircle className="text-gray-500" />;
    } else {
      return value;
    }
  };

  const handleExpandToggle = (index) => {
    setExpandedItems((prevExpandedItems) => ({
      ...prevExpandedItems,
      [index]: !prevExpandedItems[index], // Toggle the current item's expanded state
    }));
  };

  const handleQuestionAnswer = (questionNumber, answer) => {
    if (questionNumber === 1) {
      const selectedItemsString = selectedItems.join(", ");
      const slug = params?.slug || "";
      const resultString = `${selectedItemsString}, ${slug}`;
      fetchComapare(resultString);
    } else if (questionNumber === 2) {
      const selectedItemsString = selectedItems.join(", ");
      fetchComapare(selectedItemsString);
    }
  };

  const handleComapreMessaage = () => {
    const newUserMessage = {
      compareQuestion: "Would you like to compare with this current product?",
      isBot: true,
      id: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
  };

  function formatString(input) {
    return input
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first char of each word
      .join(" ");
  }

  console.log(messages);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <div className="min-w-screen min-h-screen mt-[7%] p-4">
        <div className="max-w-8xl mx-auto">
          <div
            className={clsx("lg:flex lg:space-x-8", {
              "lg:flex-col items-center ": botExpand,
              "lg:flex-row items-start": !botExpand,
            })}
          >
            {/* Left column: Images and Chat */}
            <div
              className={clsx("transition-all duration-500 space-y-4", {
                "lg:w-1/2": !botExpand,
                "lg:w-11/12": botExpand,
              })}
            >
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={`${params?.slug}`}
                      className="w-1/2 truncate"
                    >
                      {productDetails?.[0]?.title}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Link
                href="/"
                className="m-0 hover:bg-white hover:underline px-0 py-2 flex items-center justify-start gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back to
              </Link>
              {/* Product Images */}
              <div>
                <h1
                  className={clsx(
                    "my-2 text-2xl font-bold text-gray-600 dark:text-blue-200",
                    {
                      hidden: !botExpand,
                      visible: botExpand,
                    }
                  )}
                >
                  {productDetails?.[0]?.title}
                </h1>
                <div className={clsx("flex")}>
                  <div
                    className={clsx(
                      " h-[300px] sm:h-[400px] lg:h-[400px] flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden",
                      {
                        "w-1/2": botExpand,
                        "w-full": !botExpand,
                      }
                    )}
                  >
                    <InnerImageZoom
                      src={currentImage}
                      zoomSrc={currentImage}
                      alt="Product Image"
                      zoomType="hover"
                      className="object-contain" // Adjust width and height as needed
                      zoomPreload={true}
                      fullscreenOnMobile={true}
                    />
                  </div>
                  <div
                    className={clsx("flex-col gap-4 m-8", {
                      hidden: !botExpand,
                      flex: botExpand,
                    })}
                  >
                    <div className="flex flex-row gap-4">
                      <div className="flex items-center gap-4">
                        <Label
                          htmlFor="quantity"
                          className="text-sm font-medium"
                        >
                          Quantity:
                        </Label>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-20"
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-[#d40029] text-white transition-all duration-300 transform hover:scale-105">
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="border-blue-400 text-blue-600 hover:bg-blue-100 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-900 transition-all duration-300 transform hover:scale-105"
                      >
                        <Heart className="mr-2 h-4 w-4" /> Save for Later
                      </Button>
                    </div>
                    <p className="text-sm font-light tracking-wider text-gray-600 dark:text-gray-400">
                      Item # {productDetails?.[0]?.item_number}
                    </p>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < 4
                              ? "text-blue-600 fill-blue-600"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                        (4.0)
                      </span>
                    </div>
                    <p className="mt-2 relative text-xl font-bold mb-2 text-[#121212ed] dark:text-blue-300">
                      <span className="absolute -top-4 left-0 right-0 text-sm text-[#121212a8]">
                        Price
                      </span>{" "}
                      {productDetails?.[0]?.pricing}
                    </p>
                  </div>
                </div>
                {!botExpand && (
                  <div className="relative mt-4">
                    <button
                      onClick={handlePrevious}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <ScrollArea className="w-full">
                      <div className="flex space-x-2 py-2 px-8">
                        {productDetails?.[0]?.images_url?.map(
                          (image, index) => (
                            <>
                              <button
                                key={index}
                                onClick={() => handleImageClick(image, index)}
                                className={`flex-shrink-0 ${
                                  index === sliderIndex
                                    ? "ring-2 ring-blue-500"
                                    : ""
                                }`}
                              >
                                <img
                                  src={image}
                                  alt={`Product thumbnail ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="object-cover rounded-md"
                                />
                              </button>
                            </>
                          )
                        )}
                      </div>
                    </ScrollArea>
                    <button
                      onClick={handleNext}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>

              {/* Chat Section */}
              <div className="pt-2 ">
                <div className="rounded-ss-md rounded-se-md bg-gradient-to-r from-blue-500 to-blue-600 p-3 flex items-center justify-between gap-2">
                  <div className="text-white flex items-center justify-start gap-2">
                    <BotMessageSquare className="w-8 h-8" />
                    <p className="text-xl font-bold">RetailGenie</p>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      className="text-white hover:text-white bg-blue-600 hover:bg-blue-600/80"
                      onClick={() => setBotExpand(!botExpand)}
                    >
                      {!botExpand ? (
                        <Maximize2 className="w-6 h-6" />
                      ) : (
                        <Minimize2 className="w-6 h-6" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="w-full space-y-4">
                  <motion.div
                    initial={{ height: 300 }}
                    animate={{
                      height: botExpand ? 500 : 300,
                    }}
                    transition={{ duration: 0.5 }} // You can adjust the duration here
                    className={clsx(
                      "w-full border border-gray-300 rounded-ee-md rounded-es-md p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-y-scroll scrollbar-none scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                    )}
                    ref={scrollAreaRef}
                  >
                    {messages.map((message, index) => {
                      const isLastMessage = index === messages.length - 1;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.isBot ? "justify-start" : "justify-end"
                          } mb-4`}
                        >
                          <div
                            className={`flex items-start ${
                              message.isBot ? "flex-row" : "flex-row-reverse"
                            }`}
                          >
                            <Avatar
                              className={`w-8 h-8 ${
                                message.isBot ? "mr-2" : "ml-2"
                              }`}
                            >
                              <AvatarImage
                                src={
                                  message.isBot
                                    ? "/placeholder.svg?height=32&width=32"
                                    : "/placeholder.svg?height=32&width=32"
                                }
                              />
                              <AvatarFallback
                                className={clsx(
                                  "text-sm",
                                  message.isBot
                                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                    : ""
                                )}
                              >
                                {message.isBot ? "AI" : "You"}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                message.isBot
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                                  : "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                              } shadow-md`}
                            >
                              {message?.text}
                              {message?.suggestion && (
                                <>
                                  <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-1">
                                    {message?.suggestion?.map(
                                      (product, index) => (
                                        <Card
                                          key={index}
                                          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                                        >
                                          <CardHeader className="p-2 bg-gradient-to-r from-blue-500 to-blue-600">
                                            <div className="flex justify-between items-start">
                                              <CardTitle className="text-sm font-bold text-white truncate max-w-full">
                                                {product.name
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  product.name.slice(1)}
                                              </CardTitle>
                                              <Checkbox
                                                disabled={!isLastMessage}
                                                checked={selectedItems.includes(
                                                  product.item_number
                                                )}
                                                onCheckedChange={() =>
                                                  handleCheckboxChange(
                                                    product.item_number
                                                  )
                                                }
                                                className="h-5 w-5 border-white bg-white text-white"
                                              />
                                            </div>
                                          </CardHeader>
                                          <CardContent className="p-2 flex-grow">
                                            <div className="flex items-center mb-2">
                                              <Tag className="w-4 h-4 mr-2 text-blue-500" />
                                              <CardDescription className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                Item No: {product.item_number}
                                              </CardDescription>
                                            </div>
                                            <div className="mb-4">
                                              <div className="flex items-center mb-1">
                                                <Info className="w-4 h-4 mr-2 text-blue-500" />
                                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                  Overview
                                                </h3>
                                              </div>
                                              <p
                                                className={`text-sm text-gray-700 dark:text-gray-200 ${
                                                  expandedItems[index]
                                                    ? ""
                                                    : "line-clamp-3"
                                                }`}
                                              >
                                                {product?.overview}
                                              </p>
                                              {product?.overview?.length >
                                                150 && (
                                                <Button
                                                  variant="link"
                                                  onClick={() =>
                                                    handleExpandToggle(index)
                                                  }
                                                  className="mt-1 p-0 h-auto text-blue-500 hover:text-blue-700"
                                                >
                                                  {expandedItems[index]
                                                    ? "Show less"
                                                    : "Show more"}
                                                </Button>
                                              )}
                                            </div>
                                          </CardContent>
                                          <CardFooter className="p-1 bg-gray-50 dark:bg-gray-700">
                                            <Button
                                              asChild
                                              variant="ghost"
                                              className="w-full justify-between hover:bg-blue-100 dark:hover:bg-blue-900"
                                            >
                                              <Link
                                                href={`/${product.item_number}`}
                                                target="_blank"
                                                className="flex items-center"
                                              >
                                                <span>View Details</span>
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                              </Link>
                                            </Button>
                                          </CardFooter>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                  <div className="px-2 flex items-center justify-end">
                                    {message?.suggestion?.length > 0 &&
                                      selectedItems.length > 0 && (
                                        <Button
                                          disabled={
                                            isTyping ||
                                            loading ||
                                            !isLastMessage
                                          }
                                          onClick={handleComapreMessaage}
                                          className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
                                        >
                                          Compare
                                        </Button>
                                      )}
                                  </div>
                                </>
                              )}
                              {message?.compareInputValue && (
                                <>
                                  {message?.compareInputValue?.item_number_match
                                    .length > 0 && (
                                    <div className="px-1">
                                      Product Found (based on Item number)
                                    </div>
                                  )}
                                  <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-1">
                                    {message?.compareInputValue?.item_number_match?.map(
                                      (product, index) => (
                                        <Card
                                          key={index}
                                          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                                        >
                                          <CardHeader className="p-2 bg-gradient-to-r from-blue-500 to-blue-600">
                                            <div className="flex justify-between items-start">
                                              <CardTitle className="text-sm font-bold text-white truncate max-w-full">
                                                {product.title
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                  product.title.slice(1)}
                                              </CardTitle>
                                              <Checkbox
                                                disabled={!isLastMessage}
                                                checked={selectedItems.includes(
                                                  product.item_number
                                                )}
                                                onCheckedChange={() =>
                                                  handleCheckboxChange(
                                                    product.item_number
                                                  )
                                                }
                                                className="h-5 w-5 ml-3 border-white bg-white text-white"
                                              />
                                            </div>
                                          </CardHeader>
                                          <CardContent className="p-2 flex-grow">
                                            <div className="flex items-center justify-between px-2 mb-2">
                                              <CardDescription className="flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
                                                <Tag className="w-4 h-4 mr-2 text-blue-500" />
                                                Item No: {product.item_number}
                                              </CardDescription>
                                              <Link
                                                href={`/${product.item_number}`}
                                                target="_blank"
                                                className="flex items-center justify-end"
                                              >
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                              </Link>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                  {message?.compareInputValue?.product_suggest
                                    .length > 0 && (
                                    <div className="px-1">
                                      Product Found (based on Product name)
                                    </div>
                                  )}

                                  <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-1">
                                    {message?.compareInputValue?.product_suggest?.map(
                                      (category, catIndex) => (
                                        <div key={catIndex}>
                                          {/* Displaying the key as the header */}
                                          <h2 className="text-xl font-bold text-gray-800 dark:text-white my-4">
                                            {category.key}
                                          </h2>

                                          {/* Mapping over the value array */}
                                          {category?.value?.map(
                                            (product, valIndex) => (
                                              <Card
                                                key={valIndex}
                                                className="mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                                              >
                                                <CardHeader className="p-2 bg-gradient-to-r from-blue-500 to-blue-600">
                                                  <div className="flex justify-between items-start">
                                                    <CardTitle className="text-sm font-bold text-white truncate max-w-full">
                                                      {product?.name
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        product?.name.slice(1)}
                                                    </CardTitle>
                                                    <Checkbox
                                                      disabled={!isLastMessage}
                                                      checked={selectedItems.includes(
                                                        product?.item_number
                                                      )}
                                                      onCheckedChange={() =>
                                                        handleCheckboxChange(
                                                          product?.item_number
                                                        )
                                                      }
                                                      className="h-5 w-5 ml-3 border-white bg-white text-white"
                                                    />
                                                  </div>
                                                </CardHeader>

                                                <CardContent className="p-2 flex-grow">
                                                  <div className="px-2 mb-2">
                                                    <CardDescription className="flex items-center justify-start text-sm font-medium text-gray-600 dark:text-gray-300">
                                                      <Tag className="w-4 h-4 mr-2 text-blue-500" />
                                                      Item No:{" "}
                                                      {product.item_number}
                                                    </CardDescription>
                                                    <div className="mb-4">
                                                      <div className="flex items-center mb-1">
                                                        <Info className="w-4 h-4 mr-2 text-blue-500" />
                                                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                          Overview
                                                        </h3>
                                                      </div>
                                                      <p
                                                        className={`text-sm text-gray-700 dark:text-gray-200 ${
                                                          expandedItems[
                                                            valIndex
                                                          ]
                                                            ? ""
                                                            : "line-clamp-3"
                                                        }`}
                                                      >
                                                        {product?.overview}
                                                      </p>
                                                      {/* {product?.overview
                                                        ?.length > 150 && (
                                                        <Button
                                                          variant="link"
                                                          onClick={() =>
                                                            handleExpandToggle(
                                                              valIndex
                                                            )
                                                          }
                                                          className="mt-1 p-0 h-auto text-blue-500 hover:text-blue-700"
                                                        >
                                                          {expandedItems[
                                                            valIndex
                                                          ]
                                                            ? "Show less"
                                                            : "Show more"}
                                                        </Button>
                                                      )} */}
                                                    </div>
                                                    <Link
                                                      href={`/${product.item_number}`}
                                                      target="_blank"
                                                      className="flex items-center justify-end"
                                                    >
                                                      <ExternalLink className="w-4 h-4 ml-2" />
                                                    </Link>
                                                  </div>
                                                </CardContent>
                                              </Card>
                                            )
                                          )}
                                        </div>
                                      )
                                    )}
                                  </div>
                                  <div className="px-2 flex items-center justify-end">
                                    {(message?.compareInputValue
                                      ?.item_number_match.length > 0 ||
                                      message?.compareInputValue
                                        ?.product_suggest.length > 0) &&
                                      selectedItems.length > 0 && (
                                        <Button
                                          disabled={
                                            isTyping ||
                                            loading ||
                                            !isLastMessage
                                          }
                                          onClick={handleComapreMessaage}
                                          className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-md"
                                        >
                                          Compare
                                        </Button>
                                      )}
                                  </div>
                                </>
                              )}
                              {message?.compareQuestion && (
                                <div className="w-[402px] text-center m-auto bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md space-y-4">
                                  <div>
                                    <h3 className="text-sm font-semibold mb-2">
                                      {message?.compareQuestion}
                                    </h3>
                                    <div className="flex justify-center space-x-2">
                                      <Button
                                        disabled={
                                          isTyping || loading || !isLastMessage
                                        }
                                        className={`bg-white hover:text-blue-500 hover:bg-white ${
                                          question1Answer === "yes"
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:text-white hover:bg-white"
                                            : "bg-white text-blue-500"
                                        }`}
                                        onClick={() =>
                                          handleQuestionAnswer(1, "yes")
                                        }
                                      >
                                        Yes
                                      </Button>
                                      <Button
                                        variant="outline"
                                        className={`bg-white hover:text-blue-500 hover:bg-white ${
                                          question1Answer === "no"
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:text-white hover:bg-white"
                                            : "bg-white text-blue-500"
                                        }`}
                                        disabled={
                                          isTyping || loading || !isLastMessage
                                        }
                                        onClick={() =>
                                          handleQuestionAnswer(2, "no")
                                        }
                                      >
                                        No
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {message?.compare && (
                                <Card className="w-full max-w-6xl mx-auto">
                                  <CardHeader className="">
                                    <CardTitle className="text-2xl font-bold text-start mb-4">
                                      Product Comparison
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <ScrollArea className="h-[600px] overflow-x-auto">
                                      <Table>
                                        <TableHeader className="">
                                          <TableRow>
                                            <TableHead className="text-md text-black font-bold">
                                              Feature
                                            </TableHead>
                                            {Object.keys(
                                              message?.compare?.products
                                            )?.map((productKey) => (
                                              <TableHead
                                                key={productKey}
                                                className="text-md text-black font-bold"
                                              >
                                                {capitalizeFirstLetter(
                                                  message?.compare?.products[
                                                    productKey
                                                  ]
                                                )}
                                              </TableHead>
                                            ))}
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {message?.compare?.differences.map(
                                            (diff, index) => (
                                              <TableRow
                                                key={index}
                                                className={
                                                  index % 2 === 0
                                                    ? "bg-muted/50"
                                                    : ""
                                                }
                                              >
                                                <TableCell className="font-semibold">
                                                  {formatString(
                                                    diff.field_name
                                                  )}
                                                </TableCell>
                                                {Object.keys(
                                                  message?.compare?.products
                                                ).map((productKey) => (
                                                  <TableCell key={productKey}>
                                                    {renderValue(
                                                      diff.values[productKey]
                                                    )}
                                                  </TableCell>
                                                ))}
                                              </TableRow>
                                            )
                                          )}
                                        </TableBody>
                                      </Table>
                                    </ScrollArea>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {isTyping && (
                      <div className="flex justify-start mb-4">
                        <div className="flex items-start">
                          <Avatar className="w-8 h-8 mr-2">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" />
                            <AvatarFallback className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                              AI
                            </AvatarFallback>
                          </Avatar>
                          <div className="px-4 py-2 rounded-lg bg-blue-100 text-blue-800 dark:bg-[#e85a7a] dark:text-blue-100 shadow-md">
                            {loading ? (
                              <ThreeDotLoader />
                            ) : (
                              <>{currentTypingText}</>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {buttons?.map((btn, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        disabled={loading || isTyping}
                        size="sm"
                        onClick={() =>
                          handleSendMessage(btn?.id, btn?.questions)
                        }
                        className="border-blue-300 text-blue-600 hover:text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-all duration-300 transform hover:scale-105"
                      >
                        {btn?.questions}
                      </Button>
                    ))}
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleTypeMessage(inputText);
                    }}
                    className="flex space-x-2"
                  >
                    <Input
                      type="text"
                      placeholder="Type your message here..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-grow border-gray-300 focus:border-gray-300 focus:ring-gray-300 dark:border-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                    />
                    <Button
                      type="submit"
                      disabled={loading || isTyping}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-[#d40029] text-white transition-all duration-300 transform hover:scale-105"
                    >
                      <Send className="h-5 w-5 rotate-45" />
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right column: Product Details and Specifications */}
            {productDetails?.map((product, index) => (
              <div
                className={clsx("space-y-6", {
                  "lg:w-1/2 mt-8 lg:mt-0": !botExpand,
                  "lg:w-11/12 m-8": botExpand,
                })}
              >
                <div>
                  <h1
                    className={clsx(
                      "text-2xl font-bold text-gray-600 dark:text-blue-200",
                      {
                        hidden: botExpand,
                      }
                    )}
                  >
                    {product?.title}
                  </h1>
                  <p className="text-sm font-light tracking-wider text-gray-600 dark:text-gray-400">
                    Item # {product?.item_number} | Mfr # {product?.mfr_number}
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4
                            ? "text-blue-600 fill-blue-600"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      (4.0)
                    </span>
                  </div>
                </div>

                <div>
                  <p className="relative text-2xl font-bold mb-2 text-[#121212ed] dark:text-blue-300">
                    <span className="absolute -top-4 left-0 right-0 text-sm text-[#121212a8]">
                      Price
                    </span>{" "}
                    {product?.pricing}
                  </p>
                  <p className="text-gray-600 text-justify dark:text-gray-300 mb-4">
                    {product?.overview}
                  </p>
                  <div
                    className={clsx("flex-wrap gap-4 mb-4", {
                      hidden: botExpand,
                      flex: !botExpand,
                    })}
                  >
                    <div className="flex items-center gap-4">
                      <Label htmlFor="quantity" className="text-sm font-medium">
                        Quantity:
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-20"
                      />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-[#d40029] text-white transition-all duration-300 transform hover:scale-105">
                      <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-400 text-blue-600 hover:bg-blue-100 dark:border-blue-500 dark:text-blue-300 dark:hover:bg-blue-900 transition-all duration-300 transform hover:scale-105"
                    >
                      <Heart className="mr-2 h-4 w-4" /> Save for Later
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                    >
                      Adjustable Thermostat
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    >
                      Eco-Friendly
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
                    >
                      Machine Washable
                    </Badge>
                  </div>
                </div>

                <div
                  className={clsx("grid gap-4", {
                    "sm:grid-cols-2": botExpand,
                    "grid-cols-2": !botExpand,
                  })}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TruckIcon className="h-6 w-6" />
                        <span>Shipping Information</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              Estimated Delivery Date
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {shippingInfo.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Shipping To</p>
                            <p className="text-sm text-muted-foreground">
                              {shippingInfo.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowLeftRight className="h-5 w-5" />
                        Return Policy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2 text-sm">
                        <li>30-day return window</li>
                        <li>Items must be unused and in original packaging</li>
                        <li>Free returns on eligible items</li>
                        <li>Refund processed within 5-7 business days</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View Full Policy
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                {/* <Card className="">
                  <CardHeader>
                    <CardTitle className="text-md flex items-center gap-2">
                      Specifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>
                        <strong>Brand Name:</strong> {product?.brand_name}
                      </li>
                      <li>
                        <strong>Product Type:</strong> {product?.product_type}
                      </li>
                      <li>
                        <strong>Air Volume:</strong> {product?.air_volume}
                      </li>
                      <li>
                        <strong>Color:</strong> {product?.color}
                      </li>
                      <li>
                        <strong>Commercial or Residential:</strong>{" "}
                        {product?.commercial_or_residential}
                      </li>
                      <li>
                        <strong>Depth:</strong> {product?.depth}
                      </li>
                      <li>
                        <strong>ETL Listed:</strong> {product?.etl_listed}
                      </li>
                      <li>
                        <strong>Height:</strong> {product?.height}
                      </li>
                      {/* <li>
                        <strong>Number of Speed Settings:</strong>{" "}
                        {product?.number_of_speed_settings}
                      </li> 
                      <li>
                        <strong>Packaging Type:</strong>{" "}
                        {product?.packaging_type}
                      </li>
                      <li>
                        <strong>Portable:</strong> {product?.portable}
                      </li>
                      <li>
                        <strong>Remote Control:</strong>{" "}
                        {product?.remote_control}
                      </li>
                      <li>
                        <strong>UL Listed:</strong> {product?.ul_listed}
                      </li>
                      <li>
                        <strong>Volts:</strong> {product?.volts}
                      </li>
                      <li>
                        <strong>Warranty:</strong> {product?.warranty}
                      </li>
                      <li>
                        <strong>Width:</strong> {product?.width}
                      </li>
                      <li>
                        <strong>Sub Brand:</strong> {product?.sub_brand}
                      </li>
                      <li>
                        <strong>Amps:</strong> {product?.amps}
                      </li>
                      <li>
                        <strong>Bluetooth:</strong> {product?.bluetooth}
                      </li>
                      <li>
                        <strong>CARB Compliant:</strong>{" "}
                        {product?.carb_compliant}
                      </li>
                      <li>
                        <strong>Low Oil Shutdown:</strong>{" "}
                        {product?.low_oil_shutdown}
                      </li>
                      <li>
                        <strong>Wheel Kit Included:</strong>{" "}
                        {product?.wheel_kit_included}
                      </li>
                      <li>
                        <strong>Powered By:</strong> {product?.powered_by}
                      </li>
                      <li>
                        <strong>Running Watts:</strong> {product?.running_watts}
                      </li>
                      <li>
                        <strong>Starting Watts:</strong>{" "}
                        {product?.starting_watts}
                      </li>
                      <li>
                        <strong>CO Shutdown:</strong> {product?.co_shutdown}
                      </li>
                      <li>
                        <strong>Generator Type:</strong>{" "}
                        {product?.generator_type}
                      </li>
                      <li>
                        <strong>Kit or Tool Only:</strong>{" "}
                        {product?.kit_or_tool_only}
                      </li>
                      <li>
                        <strong>Inverter:</strong> {product?.inverter}
                      </li>
                      <li>
                        <strong>What's Included:</strong>{" "}
                        {product?.what_included}
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View More
                    </Button>
                  </CardFooter>
                </Card> */}
              </div>
            ))}
          </div>
        </div>
        <ChatbotBubble />
      </div>
    </>
  );
}

const ThreeDotLoader = () => (
  <div className="p-2 flex space-x-1">
    {[0, 1, 2].map((index) => (
      <div
        key={index}
        className="w-1 h-1 bg-blue-800 dark:bg-blue-100 rounded-full animate-bounce"
        style={{ animationDelay: `${index * 0.15}s` }}
      />
    ))}
  </div>
);
