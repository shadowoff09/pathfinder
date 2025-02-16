interface LoadingSpinnerProps {
    size?: number
    primaryColor?: string
    secondaryColor?: string
  }
  
  export function LoadingSpinner({
    size = 40,
    primaryColor = "#3B82F6",
    secondaryColor = "#60A5FA",
  }: LoadingSpinnerProps) {
    return (
      <div className="flex items-center justify-center" role="status">
        <svg
          width={size}
          height={size}
          viewBox="0 0 38 38"
          xmlns="http://www.w3.org/2000/svg"
          stroke={primaryColor}
          aria-label="loading"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".5" cx="18" cy="18" r="18" stroke={secondaryColor} />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
  
  