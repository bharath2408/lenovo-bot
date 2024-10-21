"use client";
import ChatbotBubble from "@/components/ChatbotBubble";
import { Button } from "@/components/ui/button";
import { data } from "@/lib/data";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = (itemNumber) => {
    router.push(`/${itemNumber}`);
  };
  return (
    <div className="bg-[#F5F5F5]  grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className=" flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="font-[sans-serif] p-4 mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.map((item, index) => (
              <div className="bg-white overflow-hidden cursor-pointer hover:shadow-lg hover:rounded-lg  transition-all relative ">
                <div className="w-full h-[200px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 p-2">
                  <img
                    src={item?.image}
                    alt="laptop1"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div class="p-6">
                  <hr className="border-2 mb-6" />
                  <div>
                    <h3 className="text-base capitalize text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                      {item?.title}
                    </h3>
                    <h4 className="text-md text-gray-800 font-bold mt-2">
                      {item?.pricing}
                    </h4>
                  </div>
                  <div className="flex space-x-1.5 mt-4">
                    <svg
                      className="w-4 fill-blue-600"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <svg
                      className="w-4 fill-blue-600"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <svg
                      className="w-4 fill-blue-600"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <svg
                      className="w-4 fill-blue-600"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <svg
                      className="w-4 fill-[#CED5D8]"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                    </svg>
                    <p className="text-base text-gray-800 !ml-2">50</p>
                  </div>
                  <Button
                    onClick={() => handleClick(item?.item_number)}
                    className="mt-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-gradient-to-r"
                  >
                    View Product
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ChatbotBubble />
      </main>
    </div>
  );
}
