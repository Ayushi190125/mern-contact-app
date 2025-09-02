import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { addRecord, updateRecord, getStates } from "../services/api";
import { formatPhone, digitsOnly } from "../utils/phone";

const schema = yup.object().shape({
  first: yup.string().required("First name is required"),
  last: yup.string().required("Last name is required"),
  phone: yup.string()
    .required("Phone is required")
    .test("len", "Enter 10 digits", (val) => digitsOnly(val || "").length === 10)
    .test("fmt", "Format must be (123)-456-7890", (val) => /^\(\d{3}\)-\d{3}-\d{4}$/.test(val || "")),
  email: yup.string()
    .required("Email is required")
    .test("simpleEmail", "Must contain @ and .", (v) => /.+@.+\..+/.test(v || "")),
  address: yup.string(),
  state: yup.string().required("State is required"),
  district: yup.string().required("District is required"),
  city: yup.string(),
  zipCode: yup.string(),
});

export default function RecordForm({ editing, onSaved, onCancel }) {
  const [map, setMap] = useState({});
  const [districts, setDistricts] = useState([]);
  

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { name: "", phone: "", email: "", address: "", state: "", district: "" },
  });

  const watchState = watch("state");
  const watchPhone = watch("phone");

  
  useEffect(() => {
    (async () => {
      const res = await getStates();
      setMap(res.data || {});
    })();
  }, []);

  
  useEffect(() => {
    if (watchState && map[watchState]) setDistricts(map[watchState]);
    else setDistricts([]);
    setValue("district", "");
  }, [watchState, map, setValue]);

  
  useEffect(() => {
    if (!watchPhone) return;
    const only = digitsOnly(watchPhone).slice(0, 10);
    if (only.length <= 10) {
      setValue("phone", formatPhone(only), { shouldValidate: true });
    }
  }, [watchPhone, setValue]);

  
  useEffect(() => {
    if (editing) {
      reset({
        first: editing.first || "",
        last: editing.last || "",
        phone: editing.phone || "",
        email: editing.email || "",
        address: editing.address || "",
        state: editing.state || "",
        district: editing.district || "",
        city: editing.city || "",
        zipCode: editing.zipCode || ""
      });
    } else {
      reset({
        first: "",
        last: "",
        phone: "",
        email: "",
        address: "",
        state: "",
        district: "",
        city: "",
        zipCode: ""
      });

    }
  }, [editing, reset]);

  const onSubmit = async (data) => {
    try {
      if (editing) {
        await updateRecord(editing._id, data); 
      } else {
        await addRecord(data); 
      }
      onSaved?.();   
      reset();       
    } catch (err) {
      console.error("Save error:", err);
      alert("Error saving record");
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card">
      <h2>{editing ? "Edit Contact" : "Add/Edit the single record Here"}</h2>

      <label>First Name</label>
      <input {...register("first")} placeholder="First name" />
      {errors.name && <p className="err">{errors.name.message}</p>}

      <label>Last Name</label>
      <input {...register("last")} placeholder="Last name" />
      {errors.name && <p className="err">{errors.name.message}</p>}

      <label>Phone</label>
      <input {...register("phone")} placeholder="(123)-456-7890" />
      {errors.phone && <p className="err">{errors.phone.message}</p>}

      <label>Email</label>
      <input {...register("email")} placeholder="name@example.com" />
      {errors.email && <p className="err">{errors.email.message}</p>}

      <label>Address</label>
      <input {...register("address")} placeholder="Street, City" />

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
        <div className="col">
          <label>City</label>
          <input {...register("city")} placeholder=" City" />
        </div>
        <div className="col">
          <label>Zip Code</label>
          <input {...register("zipCode")} placeholder="123456" />
        </div>
      </div>

      
      {editing ? (
        <div className="btn-row">
          <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
          <button type="submit">Save Changes</button>
        </div>
      ) : (
        <button type="submit">Save</button>
      )}
    </form>
  );
}
