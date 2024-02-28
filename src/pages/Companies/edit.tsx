import CustomAvatar from "@/components/custom-avatar";
import SelectOptionsWithAvatar from "@/components/select-options-with-avatar";
import { businessTypeOptions, companySizeOptions, industryOptions } from "@/constants";
import { UPDATE_COMPANY_MUTATION } from "@/graphql/mutations";
import { USERS_SELECT_QUERY } from "@/graphql/queries";
import {
  UpdateCompanyMutation,
  UpdateCompanyMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types";
import { getNameInitials } from "@/utilities";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";
import { Col, Form, Input, InputNumber, Row, Select } from "antd";
import React from "react";
import { CompanyContactsTable } from "./contacts-table";

const CompanyEdit = () => {
  const { saveButtonProps, formProps, formLoading, queryResult } = useForm<
    GetFields<UpdateCompanyMutation>,
    HttpError,
    GetVariables<UpdateCompanyMutationVariables>
  >({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
    },
  });
  const { avatarUrl, name } = queryResult?.data?.data || {};
  const { selectProps: selectPropsUsers, queryResult: queryResultUsers } =
    useSelect<GetFieldsFromList<UsersSelectQuery>>({
      resource: "users",
      optionLabel: "name",
      pagination: {
        mode: "off",
      },
      meta: {
        gqlQuery: USERS_SELECT_QUERY,
      },
    });

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={22}>
          <Edit
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form {...formProps} layout="vertical">
              <CustomAvatar
                src={avatarUrl}
                shape="square"
                name={getNameInitials(name || "")}
                style={{ height: 96, width: 96, marginBottom: "24px" }}
              />
              <Form.Item
                label="Sales owner"
                name="salesOwnerId"
                initialValue={formProps?.initialValues?.salesOwner?.id}
              >
                <Select
                  {...selectPropsUsers}
                  options={
                    queryResultUsers.data?.data?.map(
                      ({ id, name, avatarUrl }) => ({
                        value: id,
                        label: (
                          <SelectOptionsWithAvatar
                            name={name}
                            avatarUrl={avatarUrl ?? undefined}
                          />
                        ),
                      })
                    ) ?? []
                  }
                />
              </Form.Item>
              <Form.Item label="Company size" name="companySize">
                <Select options={companySizeOptions} />
              </Form.Item>
              <Form.Item label="Total revenue" name="totalRevenue">
                <InputNumber
                  autoFocus
                  addonBefore={"$"}
                  min={0}
                  placeholder="0,00"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
              <Form.Item label="Industry" name="industry">
                <Select options={industryOptions} />
              </Form.Item>
              <Form.Item label="Business type" name="businessType">
                <Select options={businessTypeOptions} />
              </Form.Item>
              <Form.Item label="Country" name="country">
                <Input placeholder="Country" />
              </Form.Item>
              <Form.Item label="Website" name="website">
                <Input placeholder="Website" />
              </Form.Item>
            </Form>
          </Edit>

        </Col>
        <Col xs={24} xl={12}>
            <CompanyContactsTable/>
        </Col>
      </Row>
    </div>
  );
};

export default CompanyEdit;
