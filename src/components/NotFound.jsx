import React from "react";
import { Link } from "react-router-dom";
import ButtonComponent from "../components/ui/ButtonComponents"; // Assuming you have a ButtonComponent
const NotFound = () => (
  <>
 

    <div class="lg:px-24 bg-white lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
      <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <div class="relative">
          <div class="absolute">
            <div class="">
              <h1 class="my-2 text-gray-800 font-bold text-2xl">
                Looks like you've found the doorway to the great nothing
              </h1>
              <p class="my-2 text-gray-800">
                Sorry about that! Please visit our hompage to get where you need
                to go.
              </p>
              <Link
                to="/home"
      className=" cursor-pointer group relative select-none  bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-full py-3 px-6 text-center align-middle font-sans text-xs font-semibold uppercase text-black shadow-md shadow-yellow-500/20 transition-all duration-200 ease-in-out hover:shadow-lg hover:shadow-yellow-500/40 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"

              >
                Go back home!
              </Link>
            </div>
          </div>
          <div>
            <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
          </div>
        </div>
      </div>
      <div>
        <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
      </div>
    </div>
  </>
);

export default NotFound;
