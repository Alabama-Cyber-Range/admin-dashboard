import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Button,
  useTheme,
} from "@aws-amplify/ui-react";

import { useSchools } from "../../hooks/useSchools";
import { School } from '@admin-dashboard/contracts/School';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { delete_school } from "../../services/api"
import { useQueryClient } from "@tanstack/react-query";

const SchoolsTable = () => {
  const { tokens } = useTheme();
  const data = useSchools();
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();

  const queryClient = useQueryClient()

  const handleDelete = async (schoolId: number) => {
    event?.preventDefault
    await delete_school(schoolId);
    await queryClient.invalidateQueries({ queryKey: ['schools'] })
  };
  return (
    <>
      <Table
        backgroundColor={tokens.colors.background.primary.value}
        caption=""
        highlightOnHover={true}
        // variation="striped"
        >
        <TableHead>
          <TableRow>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th"></TableCell>
            <TableCell as="th"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.schools?.schools?.sort((a, b) => a.name.localeCompare(b.name))?.map((item: School) => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => navigate(`/schools/${item.id}`)}
                  style={{ cursor: "pointer" }}
                  >{item.name}
                </TableCell>
                <TableCell>
                  <Button>Edit</Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleDelete(Number(item.id))}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default SchoolsTable;
