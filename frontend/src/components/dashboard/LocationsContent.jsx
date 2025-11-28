import React, { useEffect, useState } from "react";
import AddLocation from "./AddLocation";
import EditAddressModal from "./EditAddressModal";

const LocationsContent = () => {
  const [addresses, setAddresses] = useState([]);
  const [editAddress, setEditAddress] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("/api/auth/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setAddresses(data.addresses || []));
  }, []);

  const handleSaveNew = async (location) => {
    const res = await fetch("/api/auth/add-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(location),
    });

    const data = await res.json();
    setAddresses(data.addresses);
  };

  const handleEditSave = async (updatedFields) => {
    const res = await fetch(`/api/auth/address/${editAddress._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedFields),
    });

    const data = await res.json();

    setAddresses((prev) =>
      prev.map((addr) =>
        addr._id === editAddress._id ? data.address : addr
      )
    );
  };

  const deleteAddress = async (id) => {
    await fetch(`/api/auth/address/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setAddresses((prev) => prev.filter((a) => a._id !== id));
  };

  const setDefault = async (id) => {
    await fetch(`/api/auth/address/default/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a._id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <AddLocation onSave={handleSaveNew} />

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
