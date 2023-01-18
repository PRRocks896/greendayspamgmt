import React from "react";
import { useDropzone } from "react-dropzone";
import MDBox from "components/MDBox";
import { Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function DragDrop(props) {
    // console.log(props);
    /* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling
    const { onDrop, accept } = props;
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        onDrop,
    });

    return (
        <MDBox
            component="span"
            sx={{ p: 5 }}
            {...getRootProps({ className: "dropzone" })}
        >
            <input {...getInputProps()} />
            <MDBox>
                <CloudUploadIcon />
                {isDragActive ? (
                    <Typography display="block" gutterBottom>
                        Release to drop the files here
                    </Typography>
                ) : (
                    <Typography display="block" gutterBottom>
                        Drag your file here
                    </Typography>
                    )}
            </MDBox>
        </MDBox>
    );
}
