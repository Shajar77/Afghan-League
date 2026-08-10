import { useState, useRef, useEffect } from 'react'

interface SearchableDropdownProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  error?: string
  required?: boolean
}

export function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  error,
  required
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(value)
    }
  }, [value, isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputFocus = () => {
    setIsOpen(true)
    setSearchTerm('')
  }

  const handleOptionClick = (option: string) => {
    onChange(option)
    setSearchTerm(option)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    if (!isOpen) setIsOpen(true)
  }

  return (
    <div className="searchable-dropdown-container" ref={containerRef}>
      <input
        type="text"
        value={isOpen ? searchTerm : (value || '')}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
        required={required}
      />
      {isOpen && (
        <div className="dropdown-options-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionClick(option)}
                className="dropdown-option-item"
              >
                {option}
              </div>
            ))
          ) : (
            <div className="dropdown-no-results">
              No matches found
            </div>
          )}
        </div>
      )}
    </div>
  )
}
