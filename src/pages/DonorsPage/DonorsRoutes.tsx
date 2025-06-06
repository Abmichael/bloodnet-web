import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import DonorsListPage from "./DonorListPage";
import DonorDetailsPage from "./DonorDetailsPage";
import CreateDonorForm from "./CreateDonorForm";
import NearbyDonorsPage from "./NearbyDonorsPage";
import { Card } from "primereact/card";

const CreateDonorWrapper: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CreateDonorForm
        onSuccess={() => {
          navigate('/donors');
        }}
        onCancel={() => {
          navigate('/donors');
        }}
      />
    </Card>
  );
};

const DonorsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DonorsListPage />} />
      <Route path="/create" element={<CreateDonorWrapper />} />
      <Route path="/nearby" element={<NearbyDonorsPage />} />
      <Route path="/:id" element={<DonorDetailsPage />} />
    </Routes>
  );
};

export default DonorsRoutes;
