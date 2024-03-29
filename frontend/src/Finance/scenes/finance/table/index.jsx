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
  Typography,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import { Dayjs } from 'dayjs';
import theme from 'theme';
import PaymentPDF from '../../../pdf/paymentPDF';

const OrgView = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [serverSuccessMessage, setServerSuccessMessage] = useState('');
  const navigate = useNavigate();

  // GET method
  const getPaymentData = async () => {
    try {
      const response = await axios.get(`/api/payments`);
      setTableData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Running the GET method
  useEffect(() => {
    const fetchPaymentData = async () => {
      // setIsLoading(true);
      await getPaymentData();
      // setIsLoading(false);
    };
    fetchPaymentData();
  }, []);

  // CREATE method
  const handleCreateNewRow = async (values) => {
    const newValues = {
      ...values,
    };
    tableData.push(newValues);
    setTableData([...tableData]);
    try {
      const response = await axios.post(`/api/payments`, newValues);
      console.log(response);
      setServerSuccessMessage(response.data.message);
      if (serverSuccessMessage !== '') {
        Swal.fire('', response.data.message, 'success').then(() =>
          navigate('/admin/finance/dashboard')
        );
      }
    } catch (error) {
      setServerErrorMessage(error.response.data.message);
    }
  };

  // PUT method
  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    console.log(values._id);
    console.log(values.status);
    if (!Object.keys(validationErrors).length) {
      const newValues = {
        ...values,
        availableQty: values.availableQty,
      };
      tableData[row.index] = newValues;
      try {
        const response = await axios.put(
          `/api/payments/${row.getValue('_id')}`,
          {
            availableQty: values.availableQty,
          }
        );
        setServerSuccessMessage(response.data.message);
        if (serverSuccessMessage !== '') {
          Swal.fire('', response.data.message, 'success');
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
            .delete(`/api/payments/${row.getValue('_id')}`)
            .then((response) => {
              Swal.fire('Deleted!', `Deleted The Payment!`, 'success');
              console.log(response);
              tableData.splice(row.index, 1);
              setTableData([...tableData]);
            })
            .catch((error) => {
              Swal.fire('', 'Failed to Delete The Payment!.', 'error');
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

  const [status, setStatus] = useState(tableData.availableQty);

  const updateStatus = (id) => {
    console.log(status);
    console.log(id);
    if (status === 'pending') {
      setStatus('Approved');
    } else {
      setStatus('Rejected');
    }

    const updatedTableData = tableData.map((item) => {
      if (item._id === id) {
        // replace "selectedItemId" with the actual ID of the item you want to update
        return {
          ...item,
          status: status,
        };
      } else {
        return item;
      }
    });

    console.log(updatedTableData);
    setTableData(updatedTableData);
  };

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (resources) => {
          const isValid =
            cell.column.id === 'email'
              ? validateEmail(resources.target.value)
              : cell.column.id === 'age'
              ? validateAge(+resources.target.value)
              : validateRequired(resources.target.value);
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

  const statusValues = ['Approved', 'Pending', 'Rejected'];

  const columns = useMemo(
    () => [
      { accessorKey: null, header: "ID", Cell: ({ row }) => row.index + 1, size: 5, },
      {
        accessorKey: '_id',
        header: 'Payment_ID',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 10,
        columnVisibility: false,
      },
      {
        accessorKey: 'start_time',
        header: 'Start_time',
        enableEditing: false,
        size: 80,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: 'end_time',
        header: 'End_time',
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 80,
        columnVisibility: false,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        enableColumnOrdering: false,
        enableEditing: true, //disable editing on this column
        enableSorting: false,
        size: 50,
        columnVisibility: false,
        muiTableBodyCellEditTextFieldProps: () => ({
          children: statusValues.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          )),
          select: true,
        }),
      },
      {
        accessorKey: 'price',
        header: 'Price $',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
        columnVisibility: false,
      },
      {
        accessorKey: 'venue',
        header: 'Venue',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
        columnVisibility: false,
      },
      {
        accessorKey: 'organizer',
        header: 'Organier',
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
        size: 80,
        columnVisibility: false,
      },
    ],
    [getCommonEditTextFieldProps]
  );

  if (!tableData) return <h1>Loading...</h1>;

  return ( 
  <Box m="0.5rem 0.5rem">
    <Typography variant="h4" sx={{ mb: '2rem' }}>
        Payments
      </Typography>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 50,
          },
        }}
        columns={columns}
        data={tableData}
        initialState={{
          columnVisibility: { _id: false, venue: false , organizer:false},
          density: 'compact',
        }}
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
            <Tooltip arrow title="Delete">
              <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        positionActionsColumn="last"
        renderTopToolbarCustomActions={() => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              p: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            
            <PaymentPDF tableData={tableData} variant="contained" color="secondary"/>
          </Box>
        )}
      />
      <CreateNewAccountModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
    </Box>
    
  );
};

//Resources Creation Model -- Start
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
      formData.append('upload_preset', 'rytp0oyr');

      axios
        .post(
          'https://api.cloudinary.com/v1_1/dn3wwir7s/image/upload',
          formData
        )
        .then((response) => {
          console.log(response);
          const imageUrl = response.data.secure_url;
          setValues({
            ...values,
            image_url: imageUrl,
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
      <DialogTitle textAlign="center">Create New Resources</DialogTitle>
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
              if (
                column.accessorKey !== '_id' &&
                column.accessorKey !== 'status'
              ) {
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

            <Typography>Upload Resources Image (Max Size: 5MB)</Typography>
            <TextField
              key="image_url"
              name="image_url"
              type="file"
              onChange={(e) => {
                setImageSelected(e.target.files[0]);
                console.log(imageSelected);
                uploadImage();
                setValues({ ...values, [e.target.name]: e.target.value });
                console.log(values.image_url);
              }}
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          ADD Resources
        </Button>
      </DialogActions>
    </Dialog>
  );
};
//Resources Creation Model -- End

const validateRequired = (value) => !!value.length;
const validateEmail = (email) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
const validateAge = (age) => age >= 18 && age <= 50;

export default OrgView;