import React, { useEffect, useState } from "react";
import { MapPin, Edit2, Trash2, Star, Loader2, Home, X } from "lucide-react";
import { useToast } from "../Toast";
import { formatErrorMessage } from "../../utils/errorFormatter";

const AddLocation = ({ onSave }) => {
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [apartment, setApartment] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => { 
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
  
    // Don't fetch if a location is already selected
    if (selectedLocation) {
      setSuggestions([]);
      return;
    }
  
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!MAPBOX_TOKEN) return;
  
    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=za&limit=5`
        );
        const data = await res.json();
        const result = data.features?.map((item) => ({
          id: item.id,
          label: item.place_name,
        })) || [];
        setSuggestions(result);
      } catch (err) {
        console.error("Mapbox Error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [query, selectedLocation, MAPBOX_TOKEN]); // Added selectedLocation dependency
  

  const handleSelect = (location) => {
    setQuery(location.label);
    setSelectedLocation(location);
    setSuggestions([]); // Immediately clear suggestions
  };

  const handleSave = async () => {
    if (!selectedLocation) {
        toast.error("Please select a valid address from the suggestions first.");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        formattedAddress: selectedLocation.label,
        unitNumber: apartment || null,
      });
      setQuery("");
      setApartment("");
      setSelectedLocation(null);
      toast.success("Address saved successfully!");
    } catch (error) {
      console.error("Error saving address:", error);
      const friendlyError = formatErrorMessage(error);
      toast.error(friendlyError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl lg:rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8 shadow-sm border border-blue-100">
      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
          Add New Location
        </h2>
        <p className="text-gray-600 text-xs lg:text-sm">Search and save your frequently used addresses</p>
      </div>

      <div className="relative mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
        <div className="flex items-center border-2 border-blue-300 focus-within:border-blue-500 rounded-xl px-4 py-3 bg-white shadow-sm transition-all">
          <MapPin className="text-blue-600 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="Start typing your address..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedLocation(null);
              setSuggestions([]); // Clear suggestions when user types
            }}
            
            className="w-full outline-none text-gray-800"
          />
          {loading && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
          {query && !loading && (
            <button
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                setSelectedLocation(null);
              }}
              className="ml-2"
            >
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="absolute bg-white w-full border-2 border-blue-200 rounded-xl mt-2 shadow-xl z-50 max-h-72 overflow-y-auto">
            {suggestions.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex items-start gap-3 px-4 py-3 text-left w-full hover:bg-blue-50 transition-colors border-b last:border-b-0"
              >
                <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                <span className="text-gray-800 text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        )}

        {selectedLocation && (
          <div className="mt-2 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Address selected
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Unit / Apartment <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="flex items-center border-2 border-gray-300 focus-within:border-blue-500 rounded-xl px-4 py-3 bg-white shadow-sm transition-all">
          <Home className="text-gray-500 w-5 h-5 mr-3" />
          <input
            type="text"
            placeholder="e.g., Apt 4B, Unit 12"
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            className="w-full outline-none text-gray-800"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!selectedLocation || saving}
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg transition-all"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Address"
        )}
      </button>
    </div>
  );
};

const EditAddressModal = ({ address, onSave, onClose }) => {
  const [formattedAddress, setFormattedAddress] = useState(address.formattedAddress || "");
  const [unitNumber, setUnitNumber] = useState(address.unitNumber || "");

  const handleSubmit = () => {
    onSave({
      formattedAddress,
      unitNumber,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-gray-900">Edit Address</h2>
        
        <div className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">Address</label>
          <input
            value={formattedAddress}
            onChange={(e) => setFormattedAddress(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">Unit / Apartment</label>
          <input
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none transition-all"
            placeholder="Optional"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const LocationsContent = () => {
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [editAddress, setEditAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/addresses`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Fetch error:", res.status, errorText);
        throw new Error(`Failed to fetch addresses: ${res.status}`);
      }
      
      const data = await res.json();
      setAddresses(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Fetch addresses error:", err);
      const friendlyError = formatErrorMessage(err);
      setError(friendlyError);
      toast.error(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNew = async (location) => {
    if (!token) {
      toast.error("Please log in to save addresses");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/save-address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(location),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save address");
      }

      const data = await res.json();
      setAddresses(data.addresses || []);
      toast.success("Address saved successfully!");
    } catch (err) {
      console.error("Save error:", err);
      const friendlyError = formatErrorMessage(err);
      toast.error(friendlyError);
      throw err;
    }
  };

  const handleEditSave = async (updatedFields) => {
    if (!token || !editAddress) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/address/${editAddress._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update address");
      }

      const data = await res.json();
      setAddresses((prev) =>
        prev.map((addr) => (addr._id === editAddress._id ? data.address : addr))
      );
      setEditAddress(null);
      toast.success("Address updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      const friendlyError = formatErrorMessage(err);
      toast.error(friendlyError);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/delete-address/${id}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete address");
      }

      const data = await res.json();
      setAddresses(data.addresses || []);
      toast.success("Address deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      const friendlyError = formatErrorMessage(err);
      toast.error(friendlyError);
    }
  };

  const setDefault = async (id) => {
    if (!token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/set-default/${id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to set default address");
      }

      const data = await res.json();
      setAddresses(data.addresses || []);
      toast.success("Default address updated successfully!");
    } catch (err) {
      console.error("Set default error:", err);
      const friendlyError = formatErrorMessage(err);
      toast.error(friendlyError);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full">
      <AddLocation onSave={handleSaveNew} />

      <div className="mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
          Your Saved Addresses
        </h2>
        <p className="text-gray-600 text-xs lg:text-sm">
          {addresses.length === 0 ? "No saved addresses yet" : `${addresses.length} saved ${addresses.length === 1 ? 'address' : 'addresses'}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 lg:px-4 py-2 lg:py-3 rounded-xl mb-4 text-sm lg:text-base">
          {error}
        </div>
      )}

      <div className="space-y-3 lg:space-y-4">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            className="bg-white border-2 border-gray-200 hover:border-blue-300 rounded-xl lg:rounded-2xl p-4 lg:p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 lg:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 lg:gap-3 mb-2">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-base lg:text-lg break-words">
                      {addr.formattedAddress}
                    </p>
                    {addr.unitNumber && (
                      <p className="text-gray-600 mt-1 text-sm lg:text-base">Unit: {addr.unitNumber}</p>
                    )}
                  </div>
                </div>
                
                {addr.isDefault && (
                  <div className="flex items-center gap-2 mt-2 lg:mt-3">
                    <span className="text-blue-600 font-bold text-xs lg:text-sm">
                      Default Address
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditAddress(addr)}
                  className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm lg:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => deleteAddress(addr._id)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => setDefault(addr._id)}
                    className="flex items-center justify-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium text-sm lg:text-base"
                  >
                    <span className="hidden sm:inline">Set Default</span>
                    <span className="sm:hidden">Default</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editAddress && (
        <EditAddressModal
          address={editAddress}
          onClose={() => setEditAddress(null)}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
};

export default LocationsContent;