import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import FlexBetween from '../../components/FlexBetween';
import Header from '../../components/Header';
import SponsorPDF from '../../pdf/SponsorPDF';

const Sponsors = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');

  const navigate = useNavigate();

  // let { eventID } = useParams();
  // eventID = eventID.toString();
  const eventID = '642e6937973a5984d960f4cd';

  const getRegisteredData = async () => {
    try {
      const response = await axios.get(` /api/partners/sponsors/${eventID}`);
      console.log(response.data.data);
      setTableData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchRegisteredData = async () => {
      // setIsLoading(true);
      await getRegisteredData();
      // setIsLoading(false);
    };
    fetchRegisteredData();
  }, []);

  //create new Row
  // const handleCreateNewRow = async (values) => {
  //   tableData.push(values);
  //   try {
  //     await axios
  //       .post(` /api/partners/sponsors`, values)
  //       .then((response) => {
  //         setServerSuccessMessage(response.data.message);
  //         if (serverSuccessMessage !== "") {
  //           Swal.fire("", serverSuccessMessage, "success").then(() =>
  //             navigate("/volunteerOpportunities")
  //           );
  //         }
  //       });
  //   } catch (error) {
  //     setServerErrorMessage(error.response.data.message);
  //   }
  //   setTableData([...tableData]);
  // };

  const handleCreateNewRow = async (values) => {
    if (!Object.keys(validationErrors).length) {
      const newValues = {
        ...values,
        eventID: `${eventID}`,
        organizationID: '642e4928973a5984d960f4bc',
      };
      tableData.push(newValues);
      setTableData([...tableData]);
      try {
        const response = await axios.post(` /api/partners/sponsors`, newValues);
        console.log(response);
        setServerSuccessMessage(response.data.message);
      } catch (error) {
        setServerErrorMessage(error.response.data.message);
      }
    }
  };

  //save updates
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    console.log(values);
    if (!Object.keys(validationErrors).length) {
      const newValues = {
        ...values,
        eventID: '643e6ca96030148f194b771d',
        organizationID: '642e4928973a5984d960f4bc',
      };
      tableData[row.index] = newValues;
      try {
        const response = await axios.put(
          ` /api/partners/sponsors/${newValues._id}`,
          newValues
        );
        setServerSuccessMessage(response.data.message);
        if (serverSuccessMessage !== '') {
          Swal.fire('', response.data.message, 'success').then(() =>
            navigate('/volunteerOpportunities')
          );
        }
      } catch (error) {
        setServerErrorMessage(error.response.data.message);
      }
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  //cancel updating
  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  //deleting row edits
  const handleDeleteRow = useCallback(
    (row) => {
      console.log(tableData._id);
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(` /api/partners/sponsors/${row.getValue('_id')}`)
            .then((response) => {
              Swal.fire('Deleted!', `Deleted The Sponsor`, 'success');
              console.log(response);
              tableData.splice(row.index, 1);
              setTableData([...tableData]);
            })
            .catch((error) => {
              Swal.fire('', 'Failed to Delete The Sponsor.', 'error');
              console.log(error);
            });
        }
      });
    },
    [tableData]
  );

  useEffect(() => {
    if (serverSuccessMessage !== '') {
      Swal.fire('', serverSuccessMessage, 'success');
    }
  }, [serverSuccessMessage]);

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(event.target.value)
              : cell.column.id === 'age'
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: '_id',
        header: 'ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
      },
      {
        accessorFn: (row) => `${row.fullName} `,
        //accessorFn used to join multiple data into a single cell
        id: 'fullName', //id is still required when using accessorFn instead of accessorKey
        header: 'Full Name',
        size: 250,

        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        Cell: ({ renderedCellValue, row }) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <img
              alt="avatar"
              height={30}
              src={row.original.sponsorImage}
              loading="lazy"
              style={{ borderRadius: '50%', height: '50px' }}
            />{' '}
            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },

      {
        accessorKey: 'packageType',
        header: 'Package Type',
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
          type: 'email',
        }),
      },
      // {
      //   accessorKey: 'sponsorImage',
      //   header: 'Sponsor Image',
      //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
      //     ...getCommonEditTextFieldProps(cell),
      //     type: 'text',
      //   }),
      // },
    ],
    [getCommonEditTextFieldProps]
  );

  return (
    <div className="mb-20 ml-10 mr-10">
      <Box>
        <div className="mb-10">
          <FlexBetween>
            <Header title="Sponsors" subtitle="Welcome!" />
          </FlexBetween>
        </div>
      </Box>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        initialState={{ columnVisibility: { sponsorImage: false } }}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <>
            <div className="flex items-center">
              <Button
                sx={{ marginRight: '5px' }}
                color="primary"
                onClick={() => setCreateModalOpen(true)}
                variant="contained"
              >
                ADD A SPONSOR
              </Button>
              <SponsorPDF tableData={tableData} />
            </div>
          </>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </div>
  );
};

//Sponsors of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
  const [values, setValues] = useState(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {})
  );

  const handleSubmit = () => {
    //put your validation logic here
    onSubmit(values);
    onClose();
  };
  const [imageSelected, setImageSelected] = useState('');

  const uploadImage = () => {
    if (imageSelected) {
      const formData = new FormData();
      formData.append('file', imageSelected);
      formData.append('upload_preset', 'vief6ix8');

      axios
        .post(
          'https://api.cloudinary.com/v1_1/dpi1yqznl/image/upload',
          formData
        )
        .then((response) => {
          console.log(response);
          const imageUrl = response.data.secure_url;
          setValues({
            ...values,
            sponsorImage: imageUrl,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    uploadImage();
  }, [imageSelected]);
  return (
    <Dialog open={open}>
      <DialogTitle textAlign="center">Create New Account</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => {
              if (!column.accessorKey) {
                return (
                  <TextField
                    key={column.id}
                    label={column.header}
                    name={column.id}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        [e.target.name]: e.target.value,
                      })
                    }
                  />
                );
              }
              if (column.accessorKey !== '_id') {
                return (
                  <TextField
                    key={column.accessorKey}
                    label={column.header}
                    name={column.accessorKey}
                    onChange={(e) =>
                      setValues({ ...values, [e.target.name]: e.target.value })
                    }
                  />
                );
              } else {
                console.log(column.accessorKey);
              }
            })}
            <TextField
              key="sponsorImage"
              label="Sponsor Image"
              name="sponsorImage"
              type="file"
              onChange={(e) => {
                setImageSelected(e.target.files[0]);
                console.log(imageSelected);
                uploadImage();
                setValues({ ...values, [e.target.name]: e.target.value });
              }}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleSubmit();
          }}
          variant="contained"
        >
          ADD THE SPONSOR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default Sponsors;
