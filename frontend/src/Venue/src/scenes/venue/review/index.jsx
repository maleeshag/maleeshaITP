import React, { useEffect, useState, useMemo } from "react";
import { Box } from "@mui/material";
import FlexBetween from "Venue/src/components/FlexBetween";
import Header from "Venue/src/components/Header";
import axios from "axios";
import MaterialReactTable from "material-react-table";
import Typography from "@mui/material/Typography";
import Cookie from "js-cookie";

const VReview = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/reviews/venue-manager/" + Cookie.get("id"))
            .then((response) => setReviews(response.data))
            .catch((error) => console.error(error));
    }, []);

    const columns = useMemo(
        () => [
            { accessorKey: "row", header: "Number" },
            { accessorKey: "rating", header: "Rating" },
            { accessorKey: "review", header: "Review" },
            { accessorKey: "organizer.name", header: "Organizer" },
            { accessorKey: "venue.name", header: "Venue" },
        ],
        []
    );

    return (
        <Box m="1.5rem 2.5rem">
            <FlexBetween>
                <Header title="All Reviews for my venues" />
            </FlexBetween>
            {reviews.length === 0 ? (
                <Typography
                    variant="h6"
                    align="center"
                    sx={{
                        mt: 10,
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        border: "2px dashed gray",
                        p: 2,
                    }}
                >
                    No reviews in the database.
                </Typography>
            ) : (
                <Box mt={4}>
                    <MaterialReactTable columns={columns} data={reviews} />
                </Box>
            )}
        </Box>
    );
};

export default VReview;
