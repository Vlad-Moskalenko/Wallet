import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChakraProvider, Switch } from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

import { addTransaction } from 'redux/transactions/operations';
import { selectCategories } from 'redux/transactions/transactionsSlice';
import Button from 'components/Button/Button';

import css from './AddTransactionForm.module.css';
import { toggleModalAddTransactionOpen } from 'redux/global/globalSlice';
import DropdownMenu from 'components/DropdownMenu/DropdownMenu';

const initialValues = {
  transactionDate: '',
  // categoryId: '',
  comment: '',
  amount: '',
};

const schema = yup.object().shape({
  // categoryId: yup.string().required('Pls select category'),
  amount: yup.number().required().positive().integer(),
  comment: yup.string().min(2),
  transactionDate: yup.date().required(),
});

export const AddTransactionForm = () => {
  const categories = useSelector(selectCategories);
  const expenseCategories = categories.filter(el => el.type !== 'INCOME');
  const incomeCategories = categories.filter(el => el.type === 'INCOME');
  const incomeCategoriesId = incomeCategories.map(el => {
    return el.id;
  });

  // SWITCH TRANSACTION TYPE====================================================
  const [isIncomeTransaction, setIsIncomeTransaction] = useState(true);
  const [categoryIdFromDropdown, SetCategoryIdFromDropdown] = useState('');
  console.log('categoryIdFromDropdown:', categoryIdFromDropdown);

  const toggleTransactionType = () => {
    setIsIncomeTransaction(isIncomeTransaction => !isIncomeTransaction);
  };
  // ====================================================

  const dispatch = useDispatch();

  const handleSubmit = (values, actions) => {
    if (isIncomeTransaction) {
      values.type = 'INCOME';
      values.categoryId = incomeCategoriesId[0];
    } else {
      values.amount = -values.amount;
      values.type = 'EXPENSE';
      categoryIdFromDropdown
        ? (values.categoryId = categoryIdFromDropdown)
        : (values.categoryId = expenseCategories[8].id);
    }

    console.log(values);
    dispatch(addTransaction(values));
    dispatch(toggleModalAddTransactionOpen());
    actions.resetForm();
  };

  const handleDropDown = categoryId => {
    SetCategoryIdFromDropdown(categoryId);
  };
  return (
    <div className={css.wrapper}>
      <h2 className={css.formTitle}>Add transaction</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        <Form className={css.form}>
          <div>
            <label htmlFor="transactionType">Income</label>
            <ChakraProvider>
              <Switch
                onChange={toggleTransactionType}
                id="transactionType"
                size="lg"
                colorScheme="green"
                name="transactionType"
              />
            </ChakraProvider>

            <label>Expense</label>
          </div>
          {!isIncomeTransaction && (
            <>
              <label className={css.inputLabel}>
                {/* <Field
                  className={css.formInput}
                  as="select"
                  name="categoryId"
                  placeholder="Select a category"
                >
                  {expenseCategories.map(({ id, name }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="categoryId" component="div" /> */}
              </label>
              <DropdownMenu
                expenseCategories={expenseCategories}
                handleDropDown={handleDropDown}
              />
            </>
          )}

          <div className={css.amountDateWrapper}>
            <label className={css.inputLabel}>
              <Field
                className={css.formInput}
                type="text"
                name="amount"
                placeholder="0.00"
              />
              <ErrorMessage name="amount" component="div" />
            </label>
            <label className={css.inputLabel}>
              <Field
                className={css.formInput}
                type="date"
                name="transactionDate"
              />
              <ErrorMessage name="transactionDate" component="div" />
            </label>
          </div>
          <label className={css.inputLabel}>
            <Field
              className={css.formInput}
              type="text"
              name="comment"
              placeholder="Comment"
            />
            <ErrorMessage name="comment" component="div" />
          </label>

          <Button type="submit" content={'add'} hasAccent={true} />
        </Form>
      </Formik>

      <Button
        type="button"
        content={'cancel'}
        onClick={() => {
          dispatch(toggleModalAddTransactionOpen());
        }}
      />
    </div>
  );
};
