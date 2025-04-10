const SalonImageCard = ({ salon, theme }) => {
    const placeholder = getSalonPlaceholder(salon.name);
    
    return (
      <div className="w-full h-64 mb-6 rounded-lg overflow-hidden relative">
        {salon.images?.[0] ? (
          <img
            src={salon.images[0]}
            alt={salon.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              if (placeholder) {
                e.target.src = placeholder;
              } else {
                e.target.style.display = 'none';
              }
            }}
          />
        ) : placeholder ? (
          <img
            src={placeholder}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 flex items-center justify-center ${
            theme === "light" ? "bg-gray-200" : "bg-gray-700"
          }`}>
            <span className={theme === "light" ? "text-gray-500" : "text-gray-300"}>
              {salon.name}
            </span>
          </div>
        )}
      </div>
    );
  };