import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { Autocomplete, TextField, InputAdornment, Grid } from "@mui/material";
import { BusinessOutlined } from "@mui/icons-material";
import type { QuotationStepData } from "../../interfaces/QuotationStepData";
import type { Customer } from "../../interfaces/Customer";

interface CustomerDropdownProps {
    control: Control<Partial<QuotationStepData>>;
    errors: FieldErrors<Partial<QuotationStepData>>;
    filteredClients: { id: string; name: string }[];
    setClientSearch: (value: string) => void;
    handleClientSelect: (client: Customer) => void;
    renderClientOption: (option: Customer) => React.JSX.Element;
}
const CustomerDropdown: React.FC<CustomerDropdownProps> = ({
    control,
    errors,
    filteredClients,
    setClientSearch,
    handleClientSelect,
    renderClientOption
}) => (
    <Grid size={8}>
        <Controller
            name="step1.customer.name"
            control={control}
            rules={{ required: 'Client name is required' }}
            render={({ field }) => (
                <Autocomplete
                    {...field}
                    options={filteredClients}
                    getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                    renderOption={(props, option) => renderClientOption(option)}
                    freeSolo
                    filterOptions={(options, { inputValue }) =>
                        options.filter(option =>
                            option.name.toLowerCase().includes(inputValue.toLowerCase())
                        )
                    }
                    onInputChange={(_, value) => setClientSearch(value)}
                    onChange={(_, value) => {
                        if (typeof value === 'object' && value !== null) {
                            handleClientSelect(value);
                        } else {
                            field.onChange(value);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Client/Agency Name"
                            placeholder="Start typing to search existing clients..."
                            error={!!errors?.step1?.customer?.name}
                            helperText={"Type to search and select a client"}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <BusinessOutlined color="action" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            )}
        />
    </Grid>
)

export default CustomerDropdown;