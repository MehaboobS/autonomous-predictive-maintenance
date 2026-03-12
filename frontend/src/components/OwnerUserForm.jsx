export default function OwnerUserForm({ formData, setFormData, next }) {

  return (
    <div className="space-y-6">

      <input
        className="input"
        placeholder="Full Name"
        onChange={(e) =>
          setFormData({ ...formData, name: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Email"
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Phone"
        onChange={(e) =>
          setFormData({ ...formData, phone: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="City"
        onChange={(e) =>
          setFormData({ ...formData, city: e.target.value })
        }
      />

      <button
        onClick={next}
        className="bg-yellow-400 text-black px-6 py-3 rounded"
      >
        Next
      </button>

    </div>
  );
}