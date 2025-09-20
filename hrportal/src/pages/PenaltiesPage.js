import React, { useState, useEffect } from "react";
import api from "../api/api";
import Spinner from "../components/Spinner";

const PenaltiesPage = () => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/hr/penalties?month=${month}`);
        setPenalties(data);
      } catch (err) {
        console.error("Failed to fetch penalties", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month]);

  if (loading) return <Spinner />;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Touch Device Penalties</h1>

      {/* Month Selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                Employee
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 uppercase text-xs">
                Department
              </th>
              <th className="px-4 sm:px-6 py-3 text-center font-medium text-gray-500 uppercase text-xs">
                Penalties
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {penalties.length > 0 ? (
              penalties.map((p, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSelectedEmployee(p)}
                >
                  <td className="px-4 sm:px-6 py-3">
                    {p.name} ({p.employeeId})
                  </td>
                  <td className="px-4 sm:px-6 py-3">{p.department}</td>
                  <td
                    className={`px-4 sm:px-6 py-3 text-center font-bold ${
                      p.penaltyCount > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {p.penaltyCount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No penalties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-2">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4">
              Penalty Details – {selectedEmployee.name} (
              {selectedEmployee.employeeId})
            </h2>

            <div className="max-h-96 overflow-y-auto">
              {selectedEmployee.dates && selectedEmployee.dates.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 sm:px-4 py-2 text-left font-medium text-gray-600 uppercase text-xs">
                        Date & Time
                      </th>
                      <th className="px-3 sm:px-4 py-2 text-left font-medium text-gray-600 uppercase text-xs">
                        Action
                      </th>
                      <th className="px-3 sm:px-4 py-2 text-left font-medium text-gray-600 uppercase text-xs">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEmployee.dates.map((d, i) => (
                      <tr key={i} className="border-b">
                        <td className="px-3 sm:px-4 py-2">
                          {new Date(d.createdAt).toLocaleString()}
                        </td>
                        <td className="px-3 sm:px-4 py-2 font-medium">
                          {d.action === "Check-in"
                            ? "Mobile Check-in"
                            : d.action === "Check-out"
                            ? "Mobile Check-out"
                            : d.action}
                        </td>
                        <td className="px-3 sm:px-4 py-2">
                          {d.latitude && d.longitude ? (
                            <a
                              href={`https://www.google.com/maps?q=${d.latitude},${d.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              📍 View Location
                            </a>
                          ) : (
                            "Unknown"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No detailed penalties for this employee in the selected month.
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenaltiesPage;
