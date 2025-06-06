import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDonors } from "../../state/donors";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Paginator } from "primereact/paginator";
import { UserRole } from "../../state/auth";
import RoleBasedAccess from "../../components/RoleBasedAccess";
import CreateDonorForm from "./CreateDonorForm";
import DonorCard from "./DonorCard";
import type { Donor } from "./types";
import { extractErrorForToast } from "../../utils/errorHandling";

const DonorsPage: React.FC = () => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: donorData = { results: [], total: 0, page: 1, limit: 10 },
    isLoading,
    error,
  } = useDonors({ page, limit });
  const donors =
    (donorData.results as Donor[]) || (donorData as unknown as Donor[]);
  const totalRecords =
    donorData.total || (Array.isArray(donors) ? donors.length : 0);
  const handleCreateSuccess = () => {
    setShowDialog(false);
    queryClient.invalidateQueries({ queryKey: ["donors"] });
  };

  const handlePageChange = (e: {
    first: number;
    rows: number;
    page: number;
  }) => {
    setPage(e.page + 1);
    setLimit(e.rows);
  };

  return (
    <div className="p-4">
      {" "}
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="m-0">Donors Management</h1>        <div className="flex gap-2">
          <Link to="/donors/nearby">
            <Button
              label="Find Nearby Donors"
              icon="pi pi-map-marker"
              className="p-button-outlined"
            />
          </Link>
          <RoleBasedAccess allowedRoles={[UserRole.ADMIN, UserRole.BLOOD_BANK, UserRole.MEDICAL_INSTITUTION]}>
            <Button
              label="Add New Donor"
              icon="pi pi-plus"
              onClick={() => setShowDialog(true)}
            />
          </RoleBasedAccess>
        </div>
      </div>
      <Dialog
        header="Create New Donor"
        visible={showDialog}
        style={{ width: "90%", maxWidth: "900px" }}
        onHide={() => setShowDialog(false)}
        modal
      >
        <CreateDonorForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowDialog(false)}
        />
      </Dialog>
      <div className="mt-3">
        {isLoading ? (
          <div className="flex justify-content-center">
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
            <span className="ml-2">Loading donors...</span>
          </div>
        ) : error ? (
          <div className="p-message p-message-error">
            <i className="pi pi-times-circle p-message-icon"></i>
            <span className="p-message-text">
              {(() => {
                const { summary, detail } = extractErrorForToast(error);
                return `${summary}: ${detail}`;
              })()}
            </span>
          </div>
        ) : (
          <>
            {" "}
            {Array.isArray(donors) && donors.length > 0 ? (
              <div>
                <div className="grid">
                  {donors.map((donor: Donor) => (
                    <div
                      key={donor._id}
                      className="col-12 md:col-6 lg:col-4 xl:col-3"
                    >
                      <DonorCard donor={donor} />
                    </div>
                  ))}
                </div>
                <Paginator
                  first={(page - 1) * limit}
                  rows={limit}
                  totalRecords={totalRecords}
                  rowsPerPageOptions={[5, 10, 20, 50]}
                  onPageChange={handlePageChange}
                  className="mt-4"
                />
              </div>
            ) : (
              <div className="p-4 text-center">
                <i
                  className="pi pi-info-circle"
                  style={{ fontSize: "2rem", color: "var(--blue-500)" }}
                ></i>
                <p className="mt-3">
                  No donors found. Create a new donor to get started.
                </p>
                <Button
                  label="Add First Donor"
                  icon="pi pi-plus"
                  onClick={() => setShowDialog(true)}
                  className="mt-2"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonorsPage;
