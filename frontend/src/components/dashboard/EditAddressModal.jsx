import React, { useState, useEffect } from "react";

const EditAddressModal = ({ address, onSave, onClose }) => {
  const [street, setStreet] = useState(address.street);
  const [unitNumber, setUnitNumber] = useState(address.unitNumber);
  const [postalCode, setPostalCode] = useState(address.postalCode);
  const [formattedAddress, setFormattedAddress] = useState(address.formattedAddress);

  const handleSubmit = () => {
    onSave({
      street,
      unitNumber,
      postalCode,
      formattedAddress,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Address</h2>

        <label className="block mb-2 font-semibold">Street</label>
        <input
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <label className="block mb-2 font-semibold">Unit / Apartment</label>
        <input
          value={unitNumber}
          onChange={(e) => setUnitNumber(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <label className="block mb-2 font-semibold">Postal Code</label>
        <input
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAddressModal;
