import { useState } from "react";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  useTheme,
  Pagination,
} from "@aws-amplify/ui-react";
import { useNavigate } from "react-router-dom";

import { useLabs } from "../../hooks/useLabs";
import { Lab } from "@admin-dashboard/contracts/Lab";

const ModulesTable = () => {
  const { tokens } = useTheme();
  const data = useLabs();
  const navigate = useNavigate();

  // Keep these hooks outside of any condition
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sort labs
  const sortedLabs = data.labs?.labs?.sort((a: Lab, b: Lab) =>
    a.name.localeCompare(b.name)
  ) || [];

  // Pagination math
  const totalPages = Math.ceil(sortedLabs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const labsOnPage = sortedLabs.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
    window.scrollTo(0, 0);
  };

  const handleOnChange = (newPageIndex?: number) => {
    if (newPageIndex !== undefined) {
      setCurrentPage(newPageIndex);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Table
        backgroundColor={tokens.colors.background.primary.value}
        caption=""
        highlightOnHover={true}
      >
        <TableHead>
          <TableRow>
            <TableCell as="th">Title</TableCell>
            <TableCell as="th">Description</TableCell>
            <TableCell as="th">CloudShare Training ID</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {labsOnPage.map((lab: Lab) => (
            <TableRow key={lab.id}>
              <TableCell
                onClick={() => navigate(`/modules/${lab.id}`)}
                style={{ cursor: "pointer" }}
              >
                {lab.name}
              </TableCell>
              <TableCell>{lab.description}</TableCell>
              <TableCell
                  onClick={() => window.open(`https://accelerate.cloudshare.com/training/${lab.cloudshare_training_id}`)}
                  style={{ cursor: "pointer" }}
                  >
                  {lab.cloudshare_training_id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
        onChange={handleOnChange}
    />
    </>
  );
};

export default ModulesTable;
