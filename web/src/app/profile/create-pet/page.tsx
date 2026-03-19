"use client";

function PetForm(){
   return(
       <>
           {/* Mobile view first */}
           {/* wrapper */}
           <main className = "min-h-screen bg-[#FDF6EE]">
                {/* Photo upload section */}
                <div className="flex items-center border-b border-[#E8DDD0] gap-[0.9rem] pt-12 px-5 pb-3">
                    <span className = "text-[1rem] text-[#1A1A2E] cursor-pointer">&larr;</span>
                    <span className = "text-[1rem] text-[#1A1A2E]">Add Pet</span>
                </div>
                <div className ="p-5">
                    <div className ="w-full h-[130px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl border-[#E8DDD0] ">
                        <span className ="text-3xl">📷</span>
                        <span className = "text-sm text-gray">Upload Photo</span>
                    </div>
                </div>
                {/* Container for input content */}
                <div className = "p-5 flex flex-col gap-2">
                    {/* Name input */}
                    <div className = "flex flex-col">
                        <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                            Name
                        </label>
                        <input 
                            type="text" 
                            placeholder="Pet's name" 
                            className = "w-full py-3 px-3.5 border-2 rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                        />
                    </div>
                     {/* Species toggle */}
                    <div className = "flex flex-col gap-2">
                        <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Species</label>
                        {/* Button wrapper */}
                        <div className = "grid grid-cols-2 gap-2">
                            <button className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5">
                                🐕 Dog
                            </button>
                            <button className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5">
                                🐱 Cat
                            </button>
                        </div>
                    </div>
                    {/* Pet size's toggle */}
                    <div className = "flex flex-col">
                        <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Size</label>
                        {/* Button wrapper */}
                        <div className = "grid grid-cols-3 gap-2">
                            <button className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5">S</button>
                            <button className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5">M</button>
                            <button className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5">L</button>   
                        </div>
                    </div>
                    {/* Temperament toggle*/}
                    <div className = "flex flex-col">
                        <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Temperament</label>
                        {/* Button wrapper */}
                        <div className = "flex flex-wrap gap-2">
                            {/* Clickable chips */}
                            <button 
                                className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-full p-2.5 cursor-pointer"
                            >
                                Friendly
                            </button>
                            <button 
                                className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-full p-2.5 cursor-pointer"
                            >
                                Playful
                            </button>
                            <button 
                                className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-full p-2.5 cursor-pointer"
                            >
                                 Shy
                            </button>
                            <button 
                                className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-full p-2.5 cursor-pointer"
                            >
                                Energetic
                            </button>
                            <button 
                                className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-full p-2.5 cursor-pointer"
                            >
                                Calm
                            </button>
                            <button 
                                className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-full p-2.5 cursor-pointer"
                            >
                                Curious
                            </button>
                        </div>
                    </div>
                    {/* Ai section */}
                    <div className = "flex flex-col">
                        {/* Generate Bio with AI" button */}
                        <button 
                            className = "w-full py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5 cursor-pointer"
                        >
                            Generate Bio with AI
                        </button>
                        {/* Bio text area */}
                        <input 
                            type="text" 
                            placeholder="Bio would appear here..."
                            className ="w-full py-3 px-4"
                        />
                    </div>
                    <button
                        className = "w-full h-16 py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5 cursor-pointer"
                    >
                        Save Pet
                    </button>
                </div>

           </main>
       </>
   )
}
export default PetForm;