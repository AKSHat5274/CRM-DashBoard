import React from 'react'
import { CompanyPage } from '.' 
import {Form, Input, Modal, Select} from 'antd'
import { useModalForm,useSelect } from '@refinedev/antd'
import { CreateCompanyMutation, CreateCompanyMutationVariables, UsersSelectQuery } from '@/graphql/types'
import { GetFields, GetFieldsFromList, GetVariables } from '@refinedev/nestjs-query'
import { HttpError, useGo } from '@refinedev/core'
import { CREATE_COMPANY_MUTATION } from '@/graphql/mutations'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import CustomAvatar from '@/components/custom-avatar'
import SelectOptionsWithAvatar from '@/components/select-options-with-avatar'

const CreateComapny = () => {
    const go = useGo();

    const goToListPage = () => {
      go({
        to: { resource: "companies", action: "list" },
        options: {
          keepQuery: true,
        },
        type: "replace",
      });
    };

    const { formProps, modalProps } = useModalForm<
    GetFields<CreateCompanyMutation>,
    HttpError,
    GetVariables<CreateCompanyMutationVariables>
  >({
    action: "create",
    defaultVisible: true,
    resource: "companies",
    redirect: false,
    mutationMode: "pessimistic",
    onMutationSuccess: goToListPage,
    meta: {
      gqlMutation: CREATE_COMPANY_MUTATION,
    },
  });
  const { selectProps, queryResult } = useSelect<
  GetFieldsFromList<UsersSelectQuery>
>({
  resource: "users",
  meta: {
    gqlQuery: USERS_SELECT_QUERY,
  },
  optionLabel: "name",
});
console.log(selectProps,"SelectProps");
console.log(queryResult,"Query REsult")

  return (
    <CompanyPage>
       <Modal
      {...modalProps}
      mask={true}
      onCancel={goToListPage}
      title="Add new company"
      width={512}
    >
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Company name"
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Please enter company name" />
        </Form.Item>
        <Form.Item
          label="Sales owner"
          name="salesOwnerId"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Please sales owner user"
            // {...selectProps}
            options={
              queryResult.data?.data?.map((user) => ({
                value: user.id,
                label: (
                  <SelectOptionsWithAvatar
                    name={user.name}
                    avatarUrl={user.avatarUrl ?? undefined}
                  />
                ),
              })) ?? []
            }
          />
        </Form.Item>
      </Form>
    </Modal>
    </CompanyPage>
  )
}

export default CreateComapny