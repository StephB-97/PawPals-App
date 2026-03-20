"use client";

function PetForm(){
   return(
       <>
           {/* wrapper */}
           <main className = "min-h-screen bg-[#FDF6EE] md:px-6 md:py-8">
                <div className="mx-auto w-full max-w-md bg-white min-h-screen md:min-h-0 md:max-w-2xl md:rounded-2xl md:shadow-sm">
                    {/* Photo upload section */}
                    <div className="flex items-center border-b border-[#E8DDD0] gap-[0.9rem] pt-12 px-5 pb-3">
                        <span className = "text-[1rem] text-[#1A1A2E] cursor-pointer">&larr;</span>
                        <span className = "text-[1rem] text-[#1A1A2E] md:text-[1.1rem]">Add Pet</span>
                    </div>
                    <div className ="p-5">
                        <div 
                            className ="w-full h-[130px] flex flex-col items-center justify-center border-2 border-dashed rounded-2xl border-[#E8DDD0] bg-[#F9FAFB]"
                        >
                            <span className ="text-3xl">📷</span>
                            <span className = "text-sm text-gray-600">Upload Photo</span>
                        </div>
                    </div>
                    {/* Container for input content */}
                    <div className = "p-5 flex flex-col gap-4">
                        {/* Name input */}
                        <div className = "flex flex-col">
                            <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">
                                Name
                            </label>
                            <input 
                                type="text" 
                                placeholder="Pet's name" 
                                className = "w-full py-3 px-3.5 border-2 border-[#E5E7EB] rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                            />
                        </div>
                        {/* Species toggle */}
                        <div className = "flex flex-col">
                            <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Species</label>
                            {/* Button wrapper */}
                            <div className = "grid grid-cols-2 gap-2">
                                <button className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5 text-[#1A1A2E]">
                                    🐕 Dog
                                </button>
                                <button className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5 text-[#1A1A2E]">
                                    🐱 Cat
                                </button>
                            </div>
                        </div>
                        {/* Breed toggle */}
                        <div className = "flex flex-col">
                            <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Breed</label>
                            <input 
                                type="text" 
                                placeholder="Pet's breed" 
                                className = "w-full py-3 px-3.5 border-2 border-[#E5E7EB] rounded-lg outline-none text-[#1A1A2E] focus:border-[#E8734A]"
                            />
                            
                        </div>
                        {/* Pet size's toggle */}
                        <div className = "flex flex-col">
                            <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Size</label>
                            {/* Button wrapper */}
                            <div className = "grid grid-cols-3 gap-2">
                                <button 
                                    className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5 text-[#1A1A2E]"
                                >
                                    S
                                </button>
                                <button 
                                    className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5 text-[#1A1A2E]"
                                >
                                    M
                                </button>
                                <button 
                                    className = "border border-[#E8DDD0] bg-[#FFF1E8] rounded-lg p-2.5 text-[#1A1A2E]"
                                >
                                    L
                                </button>   
                            </div>
                        </div>

                        {/* Age */}
                        <div className = "flex flex-col">
                            <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Age</label>
                            <input type = "number" className = "w-full border border-[#E5E7EB] rounded-lg focus:ring-2 outline-none focus:ring-[#E8734A] text-[#1A1A2E] py-2 px-3"/>
                        </div>

                        {/* Temperament toggle*/}
                        <div className = "flex flex-col">
                            <label className="mb-1 block text-xs font-semibold text-[#1A1A2E]">Temperament</label>
                            {/* Button wrapper */}
                            <div className = "flex flex-wrap gap-2">
                                {/* Clickable chips */}
                                <button 
                                    className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] text-[#1A1A2E] rounded-full cursor-pointer"
                                >
                                    Friendly
                                </button>
                                <button 
                                    className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] text-[#1A1A2E] rounded-full cursor-pointer"
                                >
                                    Playful
                                </button>
                                <button 
                                    className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] text-[#1A1A2E] rounded-full cursor-pointer"
                                >
                                    Shy
                                </button>
                                <button 
                                    className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] text-[#1A1A2E] rounded-full cursor-pointer"
                                >
                                    Energetic
                                </button>
                                <button 
                                    className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] text-[#1A1A2E] rounded-full cursor-pointer"
                                >
                                    Calm
                                </button>
                                <button 
                                    className ="py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] text-[#1A1A2E] rounded-full cursor-pointer"
                                >
                                    Curious
                                </button>
                            </div>
                        </div>
                        {/* Ai section */}
                        <div className = "flex flex-col gap-2">
                            {/* Generate Bio with AI" button */}
                            <button 
                                className = "w-full py-2 px-3.5 border border-[#E8DDD0] bg-[#FFF1E8] text-[#1A1A2E] rounded-lg cursor-pointer"
                            >
                                Generate Bio with AI
                            </button>
                            {/* Bio text area */}
                            <input 
                                type="text" 
                                placeholder="Bio would appear here..."
                                className ="w-full h-[70px] py-3 px-4 text-[#1A1A2E] border-2 border-[#E5E7EB] rounded-lg focus:border-[#E8734A] outline-none"
                            />
                        </div>
                        <button
                            className = "w-full h-16 py-2 px-3.5 border border-[#E8734A] bg-[linear-gradient(135deg,_#FF6B6B,_#FF8C42)] text-[#1A1A2E] rounded-lg cursor-pointer text-[white]"
                        >
                            Save Pet
                        </button>
                    </div>
                </div>

           </main>
       </>
   )
}
export default PetForm;