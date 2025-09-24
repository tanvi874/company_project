'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { API_PREFIX } from 'lib/api-modifier';
// import { useSession } from 'next-auth/react'; // Remember auth

// Define the fields you want to be editable
const EDITABLE_FIELDS = [
    // Company Details
    'company', 'companyType', 'companyOrigin', 'emailAddress', 'whetherListedOrNot',
    'companyCategory', 'companySubcategory', 'classOfCompany', 'authorisedCapital',
    'paidUpCapital', 'mainDivisionDescription',
    // Address
    'streetAddress', 'streetAddress2', 'city', 'state', 'postalCode',
    // Director Details
    'DirectorFirstName', 'DirectorLastName', 'DirectorEmailAddress', 'DirectorMobileNumber',
    'DirectorPermanentAddressLine1', 'DirectorPermanentAddressLine2', 'DirectorPermanentCity',
    'DirectorPermanentState', 'DirectorPermanentPincode',
    'DirectorPresentAddressLine1', 'DirectorPresentAddressLine2', 'DirectorPresentCity',
    'DirectorPresentState', 'DirectorPresentPincode'
    // Add any other fields from your database structure
];

export default function AdminEditCompany() {
    const params = useParams();
    const router = useRouter();
    const companyId = params.id;

    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    

    // --- Add Authentication Check ---
    // ... your auth check logic ...

    // Fetch company data on load
    useEffect(() => {
        if (!companyId) return;
        setLoading(true);
        // setError(null); // Not needed if using toast
        // setSuccess(null); // Not needed if using toast
        const loadingToastId = toast.loading('Loading company data...'); // Show loading toast


        fetch(`${API_PREFIX}/admin/companies/${companyId}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch company data');
                return res.json();
            })
            .then(data => {
                setOriginalData(data);
                const initialFormData = {};
                EDITABLE_FIELDS.forEach(field => {
                    const value = data[field];
                    // Handle cases where a field might be an object (e.g., 'state')
                    // to prevent React errors. We'll default to an empty string for the input.
                    if (typeof value === 'object' && value !== null) {
                        // A better long-term solution might be to extract a specific property, like value.name
                        console.warn(`Field '${field}' contained an object and was reset to an empty string for the form.`);
                        initialFormData[field] = '';
                    } else {
                        initialFormData[field] = value ?? '';
                    }
                });
                setFormData(initialFormData);
                toast.dismiss(loadingToastId); // Dismiss loading toast on success
            })
            .catch(err => {
                console.error("Error loading data:", err);
                // Show error toast instead of setting state
                toast.error(`Error loading data: ${err.message}`, { id: loadingToastId }); // Use ID to replace loading
                // setError(`Error loading data: ${err.message}`); // Old way
            })
            .finally(() => {
                setLoading(false);
            });
    }, [companyId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
       
        const savingToastId = toast.loading('Saving changes...'); // Show saving toast

        try {
            const response = await fetch(`${API_PREFIX}/admin/companies/${companyId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save changes');
            }

            const updatedData = await response.json();
            setOriginalData(updatedData);
            const updatedFormData = {};
            EDITABLE_FIELDS.forEach(field => {
                const value = updatedData[field];
                if (typeof value === 'object' && value !== null) {
                    updatedFormData[field] = ''; // Be consistent with the initial load
                } else {
                    updatedFormData[field] = value ?? '';
                }
            });
            setFormData(updatedFormData);

            // --- 3. Show success toast ---
            toast.success('Changes saved successfully!', { id: savingToastId }); // Use ID to replace saving
            // setSuccess('Changes saved successfully!'); // Old way
            // setTimeout(() => setSuccess(null), 3000); // Old way

        } catch (err) {
             console.error("Error saving data:", err);
            // --- 4. Show error toast ---
            toast.error(`Error saving data: ${err.message}`, { id: savingToastId }); // Use ID to replace saving
            // setError(`Error saving data: ${err.message}`); // Old way
        } finally {
            setSaving(false);
        }
    };

    // Display loading indicator while fetching initial data
    if (loading) return (
        <div className="container mx-auto p-4 pt-20 text-center">
            {/* You can keep a simple loading text or use a spinner */}
            {/* Loading toast is already shown via useEffect */}
        </div>
    );

    // Display error if initial data fetch failed and we have no data to show
    if (!originalData && !loading) return (
         <div className="container mx-auto p-4 pt-20 text-center">
            <p className="text-red-500">Failed to load company data. Please try again later.</p>
            {/* Toast already showed the specific error */}
         </div>
    );


    return (
        <div className="container mx-auto p-4 pt-20">
            {/* --- 2. Add Toaster component --- */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* <h1 className="text-2xl font-bold mb-4">Edit Company: {originalData?.company || originalData?.CompanyName || companyId}</h1> */}
            <h1>
            Edit Company: 
            {typeof originalData?.company === "string"
                ? originalData.company
                : originalData?.company?.company || originalData?.CompanyName || companyId}
            </h1>

            {/* <p className="text-sm text-gray-600 mb-4">CIN: {originalData?.cin || originalData?.CIN}</p>  */}
            <p className="text-sm text-gray-600 mb-4">
            CIN: {typeof originalData?.cin === "object"
                ? JSON.stringify(originalData.cin)
                : originalData?.cin || originalData?.CIN}
            </p>


            <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg shadow-md">
                {EDITABLE_FIELDS.map(field => (
                    <div key={field}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <input
                            type={ (field.toLowerCase().includes('capital') || field.toLowerCase().includes('pincode')) ? 'number' : field.toLowerCase().includes('email') ? 'email' : 'text'}
                            id={field}
                            name={field}
                            value={formData[field] || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                ))}

                <div className="flex justify-end gap-4 pt-4"> {/* Added pt-4 */}
                     <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={saving} // Disable cancel while saving
                        className="px-4 py-2 cursor-pointer border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
