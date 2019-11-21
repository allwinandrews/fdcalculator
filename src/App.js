import React, { useState } from "react";
import {
  Input,
  Form,
  Table,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col
} from "reactstrap";
import ReactGA from "react-ga";
ReactGA.initialize("UA-153097308-1");
ReactGA.pageview(window.location.pathname + window.location.search);

export default function App() {
  const [fdDataList, setFdDataList] = useState([]);
  const [fdData, setFdData] = useState({
    deposit_amount: "",
    period: "",
    interest_rate: "",
    maturity_amount: "",
    time_frame: "Years"
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timeValue, setTimeValue] = useState("1");

  const toggle = () => setDropdownOpen(!dropdownOpen);

  const handleChange = event => {
    const data = {
      ...fdData,
      ...{ [event.target.name]: event.target.value }
    };
    setFdData(data);
  };

  const calculate = () => {
    const { deposit_amount, interest_rate, period } = fdData;
    const result = Math.round(
      deposit_amount *
        Math.pow(1 + interest_rate / 4 / 100, (4 * period) / timeValue)
    );
    const data = { ...fdData, ...{ maturity_amount: result } };
    const list = [...fdDataList, data];
    setFdData({
      deposit_amount: "",
      period: "",
      interest_rate: "",
      maturity_amount: "",
      time_frame: "Years"
    });
    setFdDataList(list);
  };

  const timeFrame = (period, count) => {
    const data = { ...fdData, ...{ time_frame: period } };
    setFdData(data);
    setTimeValue(count);
  };

  return (
    <Container>
      <Form id="fixed-deposit">
        <h1 style={{ textAlign: "center" }}>FDcalculator</h1>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Input
              name="deposit_amount"
              value={fdData.deposit_amount}
              onChange={handleChange}
              placeholder="FD Amount (Rs.)"
            />
          </Col>
        </Row>
        <Row>
          <Col
            sm="12"
            md={{ size: 6, offset: 3 }}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Input
              name="period"
              value={fdData.period}
              onChange={handleChange}
              placeholder="FD Period"
            />
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle caret>{fdData.time_frame}</DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => timeFrame("Years", 1)}>
                  Years
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => timeFrame("Months", 12)}>
                  Months
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => timeFrame("Days", 365)}>
                  Days
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Input
              name="interest_rate"
              value={fdData.interest_rate}
              onChange={handleChange}
              placeholder="Interest (%)"
            />
          </Col>
        </Row>
        <Button id="fixed-deposit-submit" onClick={calculate}>
          Submit
        </Button>
      </Form>
      {fdDataList.length ? (
        <Table>
          <thead>
            <tr>
              <th>Invested Amount</th>
              <th>Maturity Amount</th>
              <th>FD Period</th>
              <th>Interest (%)</th>
            </tr>
          </thead>
          <tbody>
            {fdDataList.slice(0).reverse().map((obj, i) => (
              <tr key={i + 1}>
                <td>{obj.deposit_amount}</td>
                <td>{obj.maturity_amount}</td>
                <td>
                  {obj.period}({obj.time_frame})
                </td>
                <td>{obj.interest_rate}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        ""
      )}
    </Container>
  );
}
