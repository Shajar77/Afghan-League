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
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(value)
      setHighlightedIndex(-1)
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
    setHighlightedIndex(-1)
  }

  const handleOptionClick = (option: string) => {
    onChange(option)
    setSearchTerm(option)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setHighlightedIndex(0)
    if (!isOpen) setIsOpen(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true)
        setHighlightedIndex(0)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : filteredOptions.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        handleOptionClick(filteredOptions[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className="searchable-dropdown-container" ref={containerRef}>
      <input
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        value={isOpen ? searchTerm : (value || '')}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={error ? 'input-error' : ''}
        required={required}
      />
      {isOpen && (
        <div className="dropdown-options-list" role="listbox">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => (
              <div
                key={option}
                role="option"
                aria-selected={value === option || highlightedIndex === idx}
                onClick={() => handleOptionClick(option)}
                className={`dropdown-option-item ${highlightedIndex === idx ? 'highlighted' : ''}`}
                style={highlightedIndex === idx ? { backgroundColor: 'rgba(250, 167, 24, 0.2)' } : {}}
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
