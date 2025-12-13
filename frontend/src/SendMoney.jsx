import { useSearchParams, useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(
        "http://localhost:3000/api/v1/accounts/transfer",
        {
          to: id,
          amount: parseFloat(amount),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setSuccess(true);
      setAmount("");
      setTimeout(() => {
        setSuccess(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Transfer failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6">
            <h1 className="text-2xl font-bold text-white text-center">
              Send Money
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Recipient Info */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-500 mb-3">
                Sending to
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-semibold text-gray-900 capitalize">
                    {name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {id?.slice(0, 8)}...
                  </p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount (in Rs)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold">
                  ₹
                </span>
                <input
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  type="number"
                  className="w-full h-12 pl-10 pr-4 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none text-lg font-medium transition-colors"
                  id="amount"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Transfer successful! Redirecting...
                </p>
              </div>
            )}

            {/* Transfer Button */}
            <button
              onClick={handleTransfer}
              disabled={loading || !amount}
              className="w-full h-12 mb-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Initiate Transfer"
              )}
            </button>

            {/* Cancel Button */}
            <button
              onClick={handleCancel}
              disabled={loading}
              className="w-full h-12 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel Transfer
            </button>

            {/* Quick Amount Buttons */}
            <div className="mt-6">
              <p className="text-xs text-gray-500 mb-2">Quick amounts</p>
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    ₹{quickAmount}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
