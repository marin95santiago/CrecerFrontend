import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, FormHelperText, Grid, IconButton, MenuItem, Select, TextField, Typography } from '@material-ui/core'
import { Cancel, Save, Schedule } from '@material-ui/icons'
import { ScheduleForm } from '../../../schemas/ElectronicBill'

const texts = {
  title: 'Programar factura',
  subtitle: 'Generar esta factura de forma periódica automaticamente',
  form: {
    name: {
      name: 'name',
      helperText: 'Nombre o código para referenciar la programación',
      placeholder: 'Nombre de referencia'
    },
    startDate: {
      name: 'startDate',
      helperText: 'Fecha de inicio de la programación*',
      placeholder: 'Fecha de inicio*'
    },
    endDate: {
      name: 'endDate',
      helperText: 'Fecha de finalizacion de la programación',
      placeholder: 'Fecha final'
    },
    intervalDays: {
      name: 'intervalDays',
      helperText: 'Intervalo o periódo para generar la factura',
      options: [
        { description: 'Semanal - genera factura cada 7 días', code: 'weekly' },
        { description: 'Quincenal - genera factura cada 15 días', code: 'biweekly' },
        { description: 'Mensual - genera factura mes a mes', code: 'monthly' }
      ]
    }
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      height: 'auto'
    },
    buttonContainer: {
      textAlign: 'right',
      width: '100%',
      padding: 10
    },
    button: {
      marginLeft: 10
    },
    media: {
      height: 300
    }
  }),
)

interface State {
  form: ScheduleForm
}

interface Props {
  show: boolean
  handleModal: (show: boolean) => void
  handleScheduleForm: (form: ScheduleForm) => void  
}

const initState: State = {
  form: {
    startDate: '',
    endDate: undefined,
    name: '',
    intervalDays: ''
  }
}

export default function ScheduleModal(props: Props) {
  const classes = useStyles()
  const [state, setState] = React.useState<State>(initState)

  // HandleChange is the handler to update the state
  // of the state, while the user writes on an input.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setState({
      ...state,
      form: {
        ...state.form,
        [name]: value
      }
    })
  }

  const handleChangeSelect = (name: string, item: { code: string, description: string }) => {
    setState({
      ...state,
      form:{
        ...state.form,
        [name]: item.code
      }
    })
  }

  return (
    <Modal
      open={props.show}
      onClose={() => props.handleModal(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className={classes.root}>
        <div>
          <Card>
            <CardHeader
              avatar={
                <Avatar  aria-label="recipe">
                  <Schedule />
                </Avatar>
              }
              action={
                <IconButton
                  onClick={() => props.handleModal(false)}
                  aria-label="settings"
                >
                  <Cancel />
                </IconButton>
              }
              title={
                <Typography variant='h6'>
                  {texts.title}
                </Typography>
              }
              subheader={texts.subtitle}
            />

            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    required={true}
                    name={texts.form.name.name}
                    value={state.form.name}
                    variant='outlined'
                    type='string'
                    fullWidth
                    onChange={handleChange}
                    helperText={texts.form.name.helperText}
                    placeholder={texts.form.name.placeholder}
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <TextField
                    required={true}
                    name={texts.form.startDate.name}
                    value={state.form.startDate}
                    variant='outlined'
                    type='date'
                    fullWidth
                    onChange={handleChange}
                    helperText={texts.form.startDate.helperText}
                    placeholder={texts.form.startDate.placeholder}
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <TextField
                    name={texts.form.endDate.name}
                    value={state.form.endDate}
                    variant='outlined'
                    type='date'
                    fullWidth
                    onChange={handleChange}
                    helperText={texts.form.endDate.helperText}
                    placeholder={texts.form.endDate.placeholder}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <Select
                    name={texts.form.intervalDays.name}
                    value={state.form.intervalDays}
                    variant="outlined"
                    fullWidth
                  >
                    {
                      texts.form.intervalDays.options.map((item) =>
                        <MenuItem
                          key={item.description}
                          value={item.code}
                          onClick={() => handleChangeSelect(texts.form.intervalDays.name, item)}
                        >
                          {item.description}
                        </MenuItem>
                      )
                    }
                  </Select>
                  <FormHelperText>{texts.form.intervalDays.helperText}</FormHelperText>
                </Grid>

              </Grid>
            </CardContent>

            <CardActions>
              <div className={classes.buttonContainer}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => props.handleScheduleForm(state.form)}
                  startIcon={<Save />}
                  className={classes.button}
                >
                  Programar
                </Button>
              </div>
            </CardActions>
          </Card>
        </div>
      </div>
    </Modal>
  )
}
