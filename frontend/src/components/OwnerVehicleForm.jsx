export default function OwnerVehicleForm({
  formData,
  setFormData,
  next,
  prev
}) {

  return (
    <div className="space-y-6">

      <input
        className="input"
        placeholder="Vehicle Number"
        onChange={(e) =>
          setFormData({ ...formData, vehicleNumber: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Manufacturer"
        onChange={(e) =>
          setFormData({ ...formData, manufacturer: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Model"
        onChange={(e) =>
          setFormData({ ...formData, model: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Year"
        onChange={(e) =>
          setFormData({ ...formData, year: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Current Mileage"
        onChange={(e) =>
          setFormData({ ...formData, mileage: e.target.value })
        }
      />

      <div className="flex gap-4">

        <button
          onClick={prev}
          className="bg-gray-700 px-6 py-3 rounded"
        >
          Back
        </button>

        <button
          onClick={next}
          className="bg-yellow-400 text-black px-6 py-3 rounded"
        >
          Next
        </button>

      </div>

    </div>
  );
}