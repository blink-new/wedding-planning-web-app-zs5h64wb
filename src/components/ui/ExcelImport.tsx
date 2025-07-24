import React, { useState, useRef } from 'react'
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, X, Download } from 'lucide-react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Alert, AlertDescription } from './alert'
import { Badge } from './badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table'
import * as XLSX from 'xlsx'

interface Guest {
  firstName: string
  lastName: string
  phoneNumber: string
  email?: string
  group?: string
}

interface ValidationError {
  row: number
  field: string
  message: string
  value: string
}

interface ExcelImportProps {
  isOpen: boolean
  onClose: () => void
  onImport: (guests: Guest[]) => void
}

export function ExcelImport({ isOpen, onClose, onImport }: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState<'upload' | 'preview' | 'complete'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    // Check if it's a valid US phone number (10 or 11 digits)
    return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'))
  }

  const formatPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+1${cleaned.slice(1)}`
    } else if (cleaned.length === 10) {
      return `+1${cleaned}`
    }
    return phone
  }

  const validateEmail = (email: string): boolean => {
    if (!email) return true // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const processExcelFile = async (file: File) => {
    setIsProcessing(true)
    setErrors([])

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

      if (jsonData.length < 2) {
        setErrors([{ row: 0, field: 'file', message: 'Excel file must contain at least a header row and one data row', value: '' }])
        setIsProcessing(false)
        return
      }

      const headers = jsonData[0].map(h => h?.toLowerCase().trim())
      const expectedHeaders = ['first name', 'last name', 'phone number', 'email', 'group']
      
      // Check if headers match our template exactly
      const headersMatch = expectedHeaders.every((header, index) => headers[index] === header) && headers.length === expectedHeaders.length
      
      if (!headersMatch) {
        setErrors([{ 
          row: 0, 
          field: 'headers', 
          message: `Please use our Excel template. Expected columns: ${expectedHeaders.map(h => h.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')).join(', ')}`, 
          value: headers.join(', ') 
        }])
        setIsProcessing(false)
        return
      }

      const processedGuests: Guest[] = []
      const validationErrors: ValidationError[] = []

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i]
        if (!row || row.every(cell => !cell)) continue // Skip empty rows

        const guest: Guest = {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          group: ''
        }

        // Map data based on headers
        headers.forEach((header, index) => {
          const value = row[index]?.toString().trim() || ''
          
          switch (header) {
            case 'first name':
            case 'firstname':
              guest.firstName = value
              break
            case 'last name':
            case 'lastname':
              guest.lastName = value
              break
            case 'phone number':
            case 'phone':
            case 'cell phone':
            case 'mobile':
              guest.phoneNumber = value
              break
            case 'email':
            case 'email address':
              guest.email = value
              break
            case 'group':
            case 'category':
              guest.group = value
              break
          }
        })

        // Validate required fields
        if (!guest.firstName) {
          validationErrors.push({ row: i + 1, field: 'firstName', message: 'First name is required', value: guest.firstName })
        }
        if (!guest.lastName) {
          validationErrors.push({ row: i + 1, field: 'lastName', message: 'Last name is required', value: guest.lastName })
        }
        if (!guest.phoneNumber) {
          validationErrors.push({ row: i + 1, field: 'phoneNumber', message: 'Phone number is required', value: guest.phoneNumber })
        } else if (!validatePhoneNumber(guest.phoneNumber)) {
          validationErrors.push({ row: i + 1, field: 'phoneNumber', message: 'Invalid phone number format', value: guest.phoneNumber })
        } else {
          guest.phoneNumber = formatPhoneNumber(guest.phoneNumber)
        }

        // Validate email if provided
        if (guest.email && !validateEmail(guest.email)) {
          validationErrors.push({ row: i + 1, field: 'email', message: 'Invalid email format', value: guest.email })
        }

        processedGuests.push(guest)
      }

      setGuests(processedGuests)
      setErrors(validationErrors)
      setStep('preview')
    } catch (error) {
      setErrors([{ row: 0, field: 'file', message: 'Failed to process Excel file. Please check the file format.', value: '' }])
    }

    setIsProcessing(false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      processExcelFile(selectedFile)
    }
  }

  const handleImport = () => {
    const validGuests = guests.filter((_, index) => 
      !errors.some(error => error.row === index + 2) // +2 because row numbers start from 1 and we skip header
    )
    onImport(validGuests)
    setStep('complete')
  }

  const downloadTemplate = () => {
    const templateData = [
      ['First Name', 'Last Name', 'Phone Number', 'Email', 'Group'],
      ['John', 'Doe', '(555) 123-4567', 'john@example.com', 'Family'],
      ['Jane', 'Smith', '555-987-6543', 'jane@example.com', 'Friends'],
      ['Bob', 'Johnson', '+1-555-555-5555', 'bob@example.com', 'Bridal Party']
    ]

    const ws = XLSX.utils.aoa_to_sheet(templateData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Guest List Template')
    XLSX.writeFile(wb, 'wedding-guest-list-template.xlsx')
  }

  const resetImport = () => {
    setFile(null)
    setGuests([])
    setErrors([])
    setStep('upload')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validGuestCount = guests.length - errors.filter(e => e.row > 1).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-wedding-primary" />
            Import Guest List from Excel
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file using our required template. All columns must match exactly.
          </DialogDescription>
        </DialogHeader>

        {step === 'upload' && (
          <div className="space-y-6">
            {/* Template Download */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Required Template</CardTitle>
                <CardDescription>
                  You must use our Excel template. Download it below and fill in your guest data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel Template
                </Button>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardContent className="pt-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-wedding-primary transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Excel File</h3>
                  <p className="text-gray-500 mb-4">
                    Select an Excel file (.xlsx or .xls) using our required template format
                  </p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Choose File'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Template Required:</strong> You must use our Excel template with exact column headers<br />
                <strong>Columns:</strong> First Name, Last Name, Phone Number, Email, Group<br />
                <strong>Phone format:</strong> Any format is accepted (e.g., (555) 123-4567, 555-123-4567, +1-555-123-4567)
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="text-sm">
                  {guests.length} total rows
                </Badge>
                <Badge variant={errors.length > 0 ? "destructive" : "default"} className="text-sm">
                  {validGuestCount} valid guests
                </Badge>
                {errors.length > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    {errors.length} errors
                  </Badge>
                )}
              </div>
              <Button variant="outline" onClick={resetImport}>
                <X className="h-4 w-4 mr-2" />
                Start Over
              </Button>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Please fix the following errors:</strong>
                  <ul className="mt-2 space-y-1">
                    {errors.slice(0, 5).map((error, index) => (
                      <li key={index} className="text-sm">
                        Row {error.row}: {error.message} ({error.field}: "{error.value}")
                      </li>
                    ))}
                    {errors.length > 5 && (
                      <li className="text-sm font-medium">
                        ...and {errors.length - 5} more errors
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Guest Preview</CardTitle>
                <CardDescription>
                  Review your guest list before importing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guests.slice(0, 20).map((guest, index) => {
                        const hasError = errors.some(error => error.row === index + 2)
                        return (
                          <TableRow key={index} className={hasError ? 'bg-red-50' : ''}>
                            <TableCell className="font-medium">
                              {guest.firstName} {guest.lastName}
                            </TableCell>
                            <TableCell>{guest.phoneNumber}</TableCell>
                            <TableCell>{guest.email || '-'}</TableCell>
                            <TableCell>{guest.group || '-'}</TableCell>
                            <TableCell>
                              {hasError ? (
                                <Badge variant="destructive" className="text-xs">Error</Badge>
                              ) : (
                                <Badge variant="default" className="text-xs">Valid</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  {guests.length > 20 && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Showing first 20 of {guests.length} guests
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Import Button */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={validGuestCount === 0}
                className="bg-wedding-primary hover:bg-wedding-primary/90"
              >
                Import {validGuestCount} Guests
              </Button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Import Successful!</h3>
              <p className="text-gray-500">
                Successfully imported {validGuestCount} guests to your wedding list.
              </p>
            </div>
            <Button onClick={onClose} className="bg-wedding-primary hover:bg-wedding-primary/90">
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}