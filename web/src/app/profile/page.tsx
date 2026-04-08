"use client";
import { SignOutButton } from "@clerk/nextjs";

function Profile (){
    return(
        <>
            {/* Avator section  */}
            <div className = "flex flex-col items-center justify-center">
                {/* Avator image or profile */}
                <div className = "rounded-full h-20 w-20 text-white bg-[#E8734A] flex items-center justify-center">
                    S
                </div>
                {/* Username */}
                <h2>Sarah Johnson</h2>
                <h1 className ="text-gray-600">Upper West Side, New York</h1>
                <button className="hidden py-3 px-5 border border-[#E8734A] bg-[white] text-[#1A1A2E] rounded-lg cursor-pointer text-[#1A1A2E] font-semibold lg:block">
                    Edit Profile
                </button>
            </div>
            {/* Highlight or stats */}
            <div className = "grid grid-cols-3 gap-4">
                {/* statcards */}
                {/* Amount of pets */}
                <div className = "flex flex-col items-center justify-center">
                    <h2>2</h2>
                    <span>Pets</span>
                </div>
                {/* Amount of matches */}
                <div className = "flex flex-col items-center justify-center">
                    <h2>3</h2>
                    <span>Matches</span>
                </div>
                {/* Amount of events */}
                <div className = "flex flex-col items-center justify-center">
                    <h2>5</h2>
                    <span>Events</span>
                </div>
            </div>
            {/* Pet card display section */}
            <section>
                <h2>My Pets</h2>
                <SignOutButton />
            </section>
        </>
    )

}
export default Profile;