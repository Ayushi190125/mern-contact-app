import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateRecord, getStates } from "../services/api.js";
import { digitsOnly, formatPhone } from "../utils/phone.js";

const schema = yup.object().shape({
  first: yup.string().trim().required("Name is required"),
  last: yup.string().trim().required("Name is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .test("len", "Enter 10 digits", (val) => digitsOnly(val || "").length === 10)
    .test("fmt", "Phone must be (123)-456-7890", (val) => /^\(\d{3}\)-\d{3}-\d{4}$/.test(val || "")),
  email: yup
    .string()
    .required("Email is required")
    .test("simpleEmail", "Email must contain @ and .", (v)=> /.+@.+\..+/.test(v || "")),
  address: yup.string().optional(),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
});

export default function EditModal({ record, onClose, onSaved }) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: record
  });

  const watchState = watch("state");
  const watchPhone = watch("phone");
  const [map, setMap] = React.useState({});
  const [districts, setDistricts] = React.useState([]);

  useEffect(() => {
    (async () => {
      const res = await getStates();
      setMap(res.data || {});
    })();
    reset(record);
  }, [record, reset]);

  useEffect(() => {
    if (watchState && map[watchState]) setDistricts(map[watchState]);
    else setDistricts([]);
  }, [watchState, map]);

  useEffect(() => {
    if (!watchPhone) return;
    const only = digitsOnly(watchPhone).slice(0,10);
    if (only.length <= 10) {
      setValue("phone", formatPhone(only), { shouldValidate: true });
    }
  }, [watchPhone, setValue]);

  const onSubmit = async (data) => {
    await updateRecord(record._id, data);
    onSaved?.();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Add/Edit the single record Here</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label> First Name</label>
          <input {...register("first")} />
          {errors.name && <p className="err">{errors.name.message}</p>}

          <label> Last Name</label>
          <input {...register("last")} />
          {errors.name && <p className="err">{errors.name.message}</p>}

          <label>Phone</label>
          <input {...register("phone")} />
          {errors.phone && <p className="err">{errors.phone.message}</p>}

          <label>Email</label>
          <input {...register("email")} />
          {errors.email && <p className="err">{errors.email.message}</p>}

          <label>Address</label>
          <input {...register("address")} />

          <div className="row">
            <div className="col">
              <label>State</label>
              <select {...register("state")}>
                <option value="">Select State</option>
                {Object.keys(map).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <p className="err">{errors.state.message}</p>}
            </div>
            <div className="col">
              <label>District</label>
              <select {...register("district")}>
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.district && <p className="err">{errors.district.message}</p>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={isSubmitting}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}