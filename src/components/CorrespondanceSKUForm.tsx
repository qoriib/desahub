"use client";

import classNames from "classnames";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Swal } from "@/services/swal.service";
import { MaritalStatus, Religion } from "@/configs/correspondance.config";
import { submitCorrespondance } from "@/app/actions";
import { useRouter } from "next/navigation";
import ImageUpload from "./ImageUpload";

const CorrespondanceSchema = z.object({
  name: z.string().min(1, { message: "Nama tidak boleh kosong" }),
  nik: z
    .string()
    .length(16, { message: "NIK harus terdiri dari 16 digit" })
    .regex(/^\d+$/, { message: "NIK hanya boleh berisi angka" }),
  birthPlace: z.string().min(1, { message: "Tempat lahir tidak boleh kosong" }),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Tanggal lahir harus dalam format YYYY-MM-DD",
    })
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Tanggal lahir tidak valid",
    }),
  religion: z.string().min(1, { message: "Pilih agama yang valid" }),
  maritalStatus: z
    .string()
    .min(1, { message: "Pilih status perkawinan yang valid" }),
  occupation: z.string().min(1, { message: "Pekerjaan tidak boleh kosong" }),
  address: z.string().min(1, { message: "Alamat tidak boleh kosong" }),
  businessDescription: z
    .string()
    .min(1, { message: "Deskripsi usaha tidak boleh kosong" })
    .max(200, {
      message: "Deskripsi usaha tidak boleh lebih dari 200 karakter",
    }),
  attachmentUrls: z
    .array(z.string().url("Format gambar tidak valid"))
    .nonempty({ message: "Sertakan lampiran" }),
  whatsappContact: z.string().regex(/^\+?\d{10,15}$/, {
    message:
      "Nomor WhatsApp harus berupa angka dengan panjang 10-15 digit, diawali dengan '+' jika perlu",
  }),
});

type CorrespondanceSchemaInputs = z.infer<typeof CorrespondanceSchema>;

const CorrespondanceForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>();

  const { control, handleSubmit } = useForm<CorrespondanceSchemaInputs>({
    resolver: zodResolver(CorrespondanceSchema),
    defaultValues: {
      name: "",
      nik: "",
      birthPlace: "",
      birthDate: "",
      religion: "",
      maritalStatus: "",
      occupation: "",
      address: "",
      businessDescription: "",
      attachmentUrls: [],
      whatsappContact: "",
    },
  });

  const onSubmit = async (formData: CorrespondanceSchemaInputs) => {
    try {
      setIsLoading(true);

      const actionRes = await submitCorrespondance(
        "SURAT_KETERANGAN_USAHA",
        formData
      );

      if (actionRes.error)
        return Swal.fire(
          actionRes.error.code,
          actionRes.error.message,
          "error"
        );

      router.push("/dashboard");
    } catch (e: unknown) {
      console.error(e);
      Swal.fire(
        "FETCH_ERROR",
        "Terjadi kesalahan saat melakukan pengambilan data",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="portlet">
      <div className="portlet-header">
        <h3 className="portlet-title text-center">Surat Keterangan Usaha</h3>
      </div>
      <div className="portlet-body">
        <form className="vstack gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <input
                  {...field}
                  type="text"
                  placeholder="Masukkan Nama"
                  className={classNames("form-control", {
                    "is-invalid": invalid,
                  })}
                />
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <Controller
            name="nik"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <input
                  {...field}
                  type="text"
                  placeholder="Masukkan NIK"
                  className={classNames("form-control", {
                    "is-invalid": invalid,
                  })}
                />
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <div className="vstack gap-2">
            <label className="form-text m-0">Tempat & tanggal lahir</label>
            <div className="hstack align-items-start gap-2">
              <Controller
                name="birthPlace"
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <div className="w-100">
                    <input
                      {...field}
                      type="text"
                      placeholder="Tempat Lahir"
                      className={classNames("form-control", {
                        "is-invalid": invalid,
                      })}
                    />
                    {invalid && (
                      <span className="invalid-feedback">{error?.message}</span>
                    )}
                  </div>
                )}
              />
              <Controller
                name="birthDate"
                control={control}
                render={({ field, fieldState: { invalid, error } }) => (
                  <div className="w-100">
                    <input
                      {...field}
                      type="date"
                      className={classNames("form-control", {
                        "is-invalid": invalid,
                      })}
                    />
                    {invalid && (
                      <span className="invalid-feedback">{error?.message}</span>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <Controller
            name="religion"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <select
                  {...field}
                  className={classNames("form-select", {
                    "is-invalid": invalid,
                  })}
                >
                  <option value="" disabled>
                    Pilih Agama
                  </option>
                  {Object.values(Religion).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <Controller
            name="maritalStatus"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <select
                  {...field}
                  className={classNames("form-select", {
                    "is-invalid": invalid,
                  })}
                >
                  <option value="" disabled>
                    Pilih Status Perkawinan
                  </option>
                  {Object.values(MaritalStatus).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <Controller
            name="occupation"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <input
                  {...field}
                  type="text"
                  placeholder="Masukkan Pekerjaan"
                  className={classNames("form-control", {
                    "is-invalid": invalid,
                  })}
                />
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <Controller
            name="address"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <textarea
                  {...field}
                  rows={5}
                  placeholder="Masukkan Alamat"
                  className={classNames("form-control", {
                    "is-invalid": invalid,
                  })}
                />
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <Controller
            name="businessDescription"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <textarea
                  {...field}
                  rows={2}
                  maxLength={200}
                  placeholder="Deskripsikan usaha Anda"
                  className={classNames("form-control", {
                    "is-invalid": invalid,
                  })}
                />
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <Controller
            name="attachmentUrls"
            control={control}
            render={({
              field: { value, onChange, disabled },
              fieldState: { invalid, error },
            }) => (
              <div className="w-100">
                <label className="form-label">Lampiran</label>
                <ImageUpload
                  multiple
                  storagePath="correspondance_imgs"
                  acceptType={["jpg", "gif", "png"]}
                  allowNonImageType={false}
                  inputProps={{ disabled }}
                  images={
                    value
                      ? value.map((dataValue) => ({ dataURL: dataValue }))
                      : []
                  }
                  setImages={(images) => {
                    onChange(
                      images.length > 0
                        ? images.map((image) => image.dataURL)
                        : []
                    );
                  }}
                />
                {invalid ? (
                  <p className="form-text text-danger mt-2 mb-0">
                    {error?.message}
                  </p>
                ) : null}
                <p className="form-text mt-2 mb-0">
                  Silahkan lampirkan
                  <ul>
                    <li>Kartu Tanda Penduduk (KTP)</li>
                    <li>Kartu Keluarga (KK)</li>
                    <li>Surat Pengantar RT atau RW</li>
                  </ul>
                </p>
              </div>
            )}
          />
          <hr className="m-0" />
          <Controller
            name="whatsappContact"
            control={control}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className="w-100">
                <input
                  {...field}
                  type="text"
                  placeholder="Masukkan Nomor WhatsApp"
                  className={classNames("form-control", {
                    "is-invalid": invalid,
                  })}
                />
                {invalid && (
                  <span className="invalid-feedback">{error?.message}</span>
                )}
              </div>
            )}
          />
          <button
            type="submit"
            className="btn btn-primary rounded-pill w-100"
            disabled={isLoading}
          >
            Ajukan
          </button>
        </form>
      </div>
    </div>
  );
};

export default CorrespondanceForm;
