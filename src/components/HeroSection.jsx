import { FaSearch, FaTimes, FaLanguage } from "react-icons/fa";

const HeroSection = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleKeyPress,
  clearSearch,
  showLanguageSearch,
  setShowLanguageSearch,
  selectedLanguage,
  setSelectedLanguage,
  languages
}) => {
  return (
    <section className="relative h-[500px] flex items-center justify-center bg-cover bg-center">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/video-hero.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>
      
      <div className="absolute inset-0 bg-black bg-opacity-30 dark:bg-opacity-50"></div>
      
      <div className="relative z-10 text-center px-5">
        <h1 className="font-heading text-3xl font-normal mb-4 text-white tracking-tight drop-shadow-lg">
          Book Your Perfect Salon Experience
        </h1>
        <p className="font-body text-white/80 dark:text-white/90 mb-8 text-lg drop-shadow-lg">
          Discover top-rated salons and book beauty services with ease
        </p>
        
        {/* Search Section */}
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      selectedLanguage
                        ? `Search services in ${selectedLanguage}...`
                        : "Search for services or salons..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="font-body w-full p-3 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#A2B9C6] dark:focus:ring-[#FADADD] focus:border-[#A2B9C6] dark:focus:border-[#FADADD] bg-white dark:bg-gray-800 text-[#4A4A4A] dark:text-gray-200"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {(searchTerm || selectedLanguage) && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Language Search Link */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setShowLanguageSearch(!showLanguageSearch)}
                  className="font-body text-[#A2B9C6] dark:text-[#FADADD] hover:text-[#91A7B4] dark:hover:text-[#f0c8cc] text-sm flex items-center gap-2"
                >
                  <FaLanguage />
                  Search by language
                </button>
                <button
                  onClick={handleSearch}
                  className="font-body px-6 py-2 bg-[#A2B9C6] dark:bg-[#FADADD] text-white dark:text-[#4A4A4A] rounded-lg hover:bg-[#91A7B4] dark:hover:bg-[#f0c8cc] transition-colors"
                >
                  Search
                </button>
              </div>

              {/* Language Search Dropdown */}
              {showLanguageSearch && (
                <div className="relative mt-2">
                  <input
                    type="text"
                    placeholder="Type to search languages..."
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="font-body w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-[#A2B9C6] dark:focus:ring-[#FADADD] focus:border-[#A2B9C6] dark:focus:border-[#FADADD] bg-white dark:bg-gray-800 text-[#4A4A4A] dark:text-gray-200"
                  />
                  {selectedLanguage && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                      {languages
                        .filter((lang) =>
                          lang.name
                            .toLowerCase()
                            .includes(selectedLanguage.toLowerCase())
                        )
                        .map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setSelectedLanguage(lang.code);
                              setShowLanguageSearch(false);
                              handleSearch();
                            }}
                            className="font-body w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-[#4A4A4A] dark:text-gray-200 flex items-center"
                          >
                            <img
                              src={`https://flagcdn.com/w20/${lang.country}.png`}
                              alt={lang.name}
                              className="w-5 h-4 mr-2"
                            />
                            {lang.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;